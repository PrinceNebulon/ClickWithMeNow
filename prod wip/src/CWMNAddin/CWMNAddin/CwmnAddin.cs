using System;
using System.Windows.Forms;
using ININ.IceLib.Connection;
using ININ.InteractionClient;
using ININ.InteractionClient.AddIn;
using ININ.InteractionClient.Interactions;

namespace ININ.Alliances.CWMNAddin
{
    public class CwmnAddin : IAddIn
    {
        public void Load(IServiceProvider serviceProvider)
        {
            try
            {
                var session = serviceProvider != null
                    ? serviceProvider.GetService(typeof (Session)) as Session
                    : null;

                if (session == null)
                {
#if DEBUG
                    session = new Session();
                    session.Connect(new SessionSettings(), 
                        new HostSettings(new HostEndpoint("tim-cic4su5.dev2000.com")),
                        new ICAuthSettings("tim.awesome", "1234"), 
                        new StationlessSettings());
                    var x = new CwmnButton(session);
#endif
                }
#if !DEBUG
                var service = ServiceLocator.Current.GetInstance<IClientInteractionButtonService>();
                if (service == null) throw new Exception("Unable to locate IClientInteractionButtonService service.");
                service.Add(new CwmnButton(session));
#endif
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Error on load: " + ex.Message + Environment.NewLine + Environment.NewLine +
                    "Please restart the Interaction Client and contact your system administrator if this issue persists.",
                    "Error loading CWMN Addin", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public void Unload()
        {
            
        }
    }
}
