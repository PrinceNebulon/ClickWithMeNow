using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Linq;
using System.Windows.Documents;
using System.Windows.Forms;
using ININ.Alliances.CWMNAddin.view;
using ININ.Alliances.CWMNAddin.viewmodel;
using ININ.IceLib.Configuration;
using ININ.IceLib.Configuration.DataTypes;
using ININ.IceLib.Connection;
using ININ.IceLib.Interactions;
using ININ.InteractionClient.Interactions;
using IInteraction = ININ.Client.Common.Interactions.IInteraction;
using InteractionState = ININ.Client.Common.Interactions.InteractionState;

namespace ININ.Alliances.CWMNAddin
{
    public class CwmnButton : IInteractionButton
    {
        #region Private Fields

        private Session _session;
        private bool _isInitialized = false;

        #endregion



        #region Public Properties

        public string Id
        {
            get { return "CWMN_BUTTON"; }
        }

        public Icon Icon
        {
            get { return Resources.CwmnIcon; }
        }

        public string Text
        {
            get { return "Click With Me Now"; }
        }

        public string ToolTipText
        {
            get { return "Click to start a new CWMN session"; }
        }

        public SupportedInteractionTypes SupportedInteractionTypes
        {
            get { return SupportedInteractionTypes.All; }
        }

        public static List<UrlViewModel> Urls = new List<UrlViewModel>();
        public static string GuestName { get; private set; }
        public static string GuestNameAttribute { get; private set; }
        public static string GuestEmail { get; private set; }
        public static string GuestEmailAttribute { get; private set; }
        public static string AgentName { get; private set; }
        public static string AgentEmail { get; private set; }
        public static string ScreenDomain { get; private set; }

        #endregion



        public CwmnButton(Session session)
        {
            try
            {
                _session = session;
                LoadConfig();
            }
            catch (Exception ex)
            {
                //TODO: initialization error
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
                MessageBox.Show(
                    "A critical error was encountered on initilization. The Hootsuite integration will not function. " +
                    "Please contact your system administrator.\n\nError message: " + ex.Message,
                    "Hootsuite Integration Initialization Failure!",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #region Private Methods

        private void LoadConfig()
        {
            // Create config list
            var configList = new StructuredParameterConfigurationList(ConfigurationManager.GetInstance(_session));

            // Create query settings
            var query = configList.CreateQuerySettings();
            query.SetPropertiesToRetrieveToAll();
            query.SetRightsFilterToView();

            // Get list
            /* NOTE: Most environments only have a couple structured parameters, so it's more efficient to 
             * retrieve all of them in one request than to do seperate queries for each. If an environment 
             * has a lot of structured parameters and this is causing performance issues, this can be 
             * rewritten to query for each individually.
             */
            configList.StartCaching(query);
            var parameterConfigurationList = configList.GetConfigurationList();

            // Find hootsuite URLS parameter
            var hootsuiteConfig =
                parameterConfigurationList.FirstOrDefault(
                    p =>
                        p.ConfigurationId.Id.ToString()
                            .Equals("hootsuite config", StringComparison.InvariantCultureIgnoreCase));
            if (hootsuiteConfig == null)
                throw new Exception("Unable to retrieve Hootsuite configuration!");

            // Get guest name attribute
            var guestNameAttribute = GetParameterValueString(hootsuiteConfig.Parameters.Value, "guest name attribute");
            if (string.IsNullOrEmpty(guestNameAttribute))
            {
                // Get guest name
                var guestName = GetParameterValueString(hootsuiteConfig.Parameters.Value, "guest name");

                if (string.IsNullOrEmpty(guestName))
                {
                    // Don't have guest name
                    GuestName = "Guest";
                    GuestNameAttribute = "";
                }
                else
                {
                    // Found guest name
                    GuestName = guestName;
                    GuestNameAttribute = "";
                }
            }
            else
            {
                // Found guest name attribute
                GuestName = "";
                GuestNameAttribute = guestNameAttribute;
            }

            // Get guest email attribute
            var guestEmailAttribute = GetParameterValueString(hootsuiteConfig.Parameters.Value, "guest email attribute");
            if (string.IsNullOrEmpty(guestNameAttribute))
            {
                // Get guest name
                var guestEmail = GetParameterValueString(hootsuiteConfig.Parameters.Value, "guest email");

                if (string.IsNullOrEmpty(guestEmail))
                {
                    // Don't have guest email
                    GuestEmail = "Guest";
                    GuestEmailAttribute = "";
                }
                else
                {
                    // Found guest name
                    GuestEmail = guestEmail;
                    GuestEmailAttribute = "";
                }
            }
            else
            {
                // Found guest name attribute
                GuestEmail = "";
                GuestEmailAttribute = guestEmailAttribute;
            }

            // Get screen domain
            ScreenDomain = GetParameterValueString(hootsuiteConfig.Parameters.Value, "screen domain");
            if (string.IsNullOrEmpty(ScreenDomain))
                throw new Exception("Unable to retrieve screen domain!");

            // Find hootsuite URLS parameter
            var hootsuiteUrls =
                parameterConfigurationList.FirstOrDefault(
                    p =>
                        p.ConfigurationId.Id.ToString()
                            .Equals("hootsuite urls", StringComparison.InvariantCultureIgnoreCase));
            if (hootsuiteUrls == null)
                throw new Exception("Unable to retrieve Hootsuite URLs!");

            // Parse URLS
            foreach (var parameter in hootsuiteUrls.Parameters.Value)
            {
                if (parameter.ParameterType != StructuredParameterType.String) continue;

                Urls.Add(new UrlViewModel
                {
                    DisplayText = parameter.Name,
                    Url = parameter.Values[0]
                });
            }

            // Get agent email settings
            var agentEmail = GetParameterValueString(hootsuiteConfig.Parameters.Value, "agent email");
            var agentEmailFromMailbox = GetParameterValueString(hootsuiteConfig.Parameters.Value, "agent email from mailbox");

            // Stop caching
            configList.StopCaching();

            // Get agent info
            GetAgentInfo(agentEmail, agentEmailFromMailbox);

            // Done
            _isInitialized = true;
        }

        private void GetAgentInfo(string agentEmail, string agentEmailFromMailbox)
        {
            // Create list
            var userConfigurationList = new UserConfigurationList(ConfigurationManager.GetInstance(_session));

            // Create query
            var query = userConfigurationList.CreateQuerySettings();
            query.SetPropertiesToRetrieve(UserConfiguration.Property.Id,
                UserConfiguration.Property.Mailbox_DisplayName,
                UserConfiguration.Property.Mailbox_EmailAddress);
            query.SetRightsFilter(UserConfiguration.Rights.LoggedInUser);
            query.SetFilterDefinition(UserConfiguration.Property.Id, _session.UserId);

            // Get list
            userConfigurationList.StartCaching(query);
            var userList = userConfigurationList.GetConfigurationList();
            
            // Get user
            var user =
                userList.FirstOrDefault(
                    u =>
                        u.ConfigurationId.Id.ToString()
                            .Equals(_session.UserId, StringComparison.InvariantCultureIgnoreCase));

            if (user == null)
            {
                AgentName = "Agent";
                AgentEmail = "fakehost@fakedomianneam.com";
                return;
            }
            
            // Set name (the display name is always the mailbox name even if there is no mailbox)
            AgentName = string.IsNullOrEmpty(user.Mailbox.DisplayName.Value)
                ? "Agent"
                : user.Mailbox.DisplayName.Value;

            // Get email
            var useMailbox = false;
            if (bool.TryParse(agentEmailFromMailbox, out useMailbox))
            {
                if (useMailbox)
                {
                    // NOTE: This is only valid for IMAP/SMTP mailboxes! Exchange or IMS will return NULL
                    AgentEmail = user.Mailbox.EmailAddress.Value;
                }
            }
            if (string.IsNullOrEmpty(AgentEmail))
            {
                AgentEmail = string.IsNullOrEmpty(agentEmail) ? "fakehost@fakedomianneam.com" : agentEmail;
            }

            // Stop caching
            userConfigurationList.StopCaching();
        }

        private string GetParameterValueString(IEnumerable<StructuredParameter> parameters, string valueName, string defaultValue = "")
        {
            // Get parameter
            var parameter =
                parameters.FirstOrDefault(p => p.Name.Equals(valueName, StringComparison.InvariantCultureIgnoreCase));

            // Return default or value
            return parameter == null
                   || parameter.ParameterType != StructuredParameterType.String
                   || parameter.Values.Count == 0
                   || string.IsNullOrEmpty(parameter.Values[0])
                ? defaultValue
                : parameter.Values[0];
        }

        #endregion



        #region Public Methods

        public bool CanExecute(IInteraction selectedInteraction)
        {
            return _isInitialized &&
                   selectedInteraction != null &&
                   (selectedInteraction.InteractionState != InteractionState.ExternalDisconnect &&
                    selectedInteraction.InteractionState != InteractionState.InternalDisconnect);
        }

        public void Execute(IInteraction selectedInteraction)
        {
            try
            {
                //  Double check
                if (!CanExecute(selectedInteraction)) return;

                // Get IceLib interaction
                var interaction =
                    InteractionsManager.GetInstance(_session)
                        .CreateInteraction(new InteractionId(selectedInteraction.InteractionId));
                if (interaction == null) return;

                // Show CWMN window
                new CwmnDialog(interaction).Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error executing CWMN Button", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #endregion
    }
}
