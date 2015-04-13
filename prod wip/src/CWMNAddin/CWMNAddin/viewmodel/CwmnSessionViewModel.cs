using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Net;
using System.Windows;
using ININ.Alliances.CWMNAddin.model;
using ININ.Alliances.CwmnTypeLib;
using ININ.InteractionClient.Attributes;
using RestSharp;

namespace ININ.Alliances.CWMNAddin.viewmodel
{
    public class CwmnSessionViewModel : ViewModelBase
    {
        #region Private Fields

        private bool _simpleSessionType;
        private ObservableCollection<UrlViewModel> _urls = new ObservableCollection<UrlViewModel>();
        private UrlViewModel _selectedUrl;
        private const string Authorization = "xPsCX7XXAPOdIeCON770z7v2bHykxZ5eAJnUKtzXjVQ0hDtJNgvd833xU3rvfv2M";
        private const string ApiUrl = "http://m.clickwith.me";
        private readonly RestClient _client;
        private string _guestLink;
        private string _hostLink;

        #endregion



        #region Public Properties

        /// <summary>
        /// [False] = View
        /// [True] = Host
        /// </summary>
        public bool SimpleSessionType
        {
            get { return _simpleSessionType; }
            set
            {
                _simpleSessionType = value;
                OnPropertyChanged();
                OnPropertyChanged("SessionType");
            }
        }

        public CwmnSessionType SessionType
        {
            get { return SimpleSessionType ? CwmnSessionType.Host : CwmnSessionType.View; }
        }

        public ObservableCollection<UrlViewModel> Urls
        {
            get { return _urls; }
            set { _urls = value; }
        }

        public UrlViewModel SelectedUrl
        {
            get { return _selectedUrl; }
            set
            {
                _selectedUrl = value;
                OnPropertyChanged();
                OnPropertyChanged("HasSelectedUrl");
            }
        }

        public bool HasSelectedUrl { get { return SelectedUrl != null; } }

        public string GuestLink
        {
            get { return _guestLink; }
            set
            {
                _guestLink = value;
                OnPropertyChanged();
                OnPropertyChanged("HasSession");
            }
        }

        public string HostLink
        {
            get { return _hostLink; }
            set
            {
                _hostLink = value;
                OnPropertyChanged();
                OnPropertyChanged("HasSession");
            }
        }

        public bool HasSession { get { return !string.IsNullOrEmpty(HostLink) && !string.IsNullOrEmpty(GuestLink); } }

        #endregion



        public CwmnSessionViewModel()
        {
            _client = new RestClient(ApiUrl);
        }



        #region Private Methods


        private T Execute<T>(Method method, string resource, params Parameter[] parameters) where T : new()
        {
            // Create request
            var request = new RestRequest(resource, method);

            // Add standard headers
            request.AddHeader("Authorization", Authorization);
            request.AddHeader("Cache-Control", "no-cache");

            // Add passed in parameters
            foreach (var parameter in parameters)
            {
                // Skip these params; we don't support them being overridden
                if (!string.IsNullOrEmpty(parameter.Name) &&
                    (parameter.Name.Equals("Authorization", StringComparison.InvariantCultureIgnoreCase) ||
                    parameter.Name.Equals("Content-Type", StringComparison.InvariantCultureIgnoreCase)))
                    continue;

                // Add parameters
                request.AddParameter(parameter);
            }

            // Execute request and get response
            var response = _client.Execute<T>(request);

            // Check for transport error (this is NOT a HTTP error status)
            if (response.ErrorException != null)
                throw new ApplicationException("Error retrieving response. Check inner details for more info.",
                    response.ErrorException);

            // Check for HTTP errors
            if (!IsStatusCodeSuccess(response.StatusCode))
                throw new Exception("Request was in error: " + response.StatusCode + " - " + response.StatusDescription);

            // Return data object
            return response.Data;
        }

        private HttpStatusCode Execute(Method method, string resource, params Parameter[] parameters)
        {
            // Create request
            var request = new RestRequest(resource, method);

            // Add standard headers
            request.AddHeader("Authorization", Authorization);

            // Add passed in parameters
            foreach (var parameter in parameters)
            {
                // Skip these params; we don't support them being overridden
                if (!string.IsNullOrEmpty(parameter.Name) &&
                    (parameter.Name.Equals("Authorization", StringComparison.InvariantCultureIgnoreCase) ||
                    parameter.Name.Equals("Content-Type", StringComparison.InvariantCultureIgnoreCase)))
                    continue;

                // Add parameters
                request.AddParameter(parameter);
            }

            // Execute request and get response
            var response = _client.Execute(request);

            // Check for transport error (this is NOT a HTTP error status)
            if (response.ErrorException != null)
                throw new ApplicationException("Error retrieving response. Check inner details for more info.",
                    response.ErrorException);

            // Return data object
            return response.StatusCode;
        }

        #endregion



        #region Public Methods

        public void StartSession()
        {
            try
            {
                // Get links
                var response = Execute<InviteToHostResponse>(Method.GET, "/session/inviteToHost",
                    new Parameter {Type = ParameterType.GetOrPost, Name = "hostName", Value = "A Host"},
                    new Parameter {Type = ParameterType.GetOrPost, Name = "hostEmail", Value = "fakehost@fakedomianneam.com"},
                    new Parameter {Type = ParameterType.GetOrPost, Name = "guestName", Value = "A Guest"},
                    new Parameter {Type = ParameterType.GetOrPost, Name = "guestEmail", Value = "fakeguest@fakedomianneam.com"},
                    new Parameter {Type = ParameterType.GetOrPost, Name = "url", Value = SelectedUrl.Url},
                    new Parameter {Type = ParameterType.GetOrPost, Name = "screenDomain", Value = "tim-cic4su5.dev2000.com"});

                // Quietly set the links to prevent multiple checks on HasSession
                _guestLink = response.GuestLink;
                _hostLink = response.HostLink;

                // Raise changed notifications
                OnPropertyChanged("GuestLink");
                OnPropertyChanged("HostLink");
                OnPropertyChanged("HasSession");

                // Launch the appropriate link
                Process.Start(SessionType == CwmnSessionType.Host
                    ? HostLink
                    : GuestLink);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public static bool IsStatusCodeSuccess(HttpStatusCode code)
        {
            return (int)code >= 200 && (int)code < 300;
        }

        #endregion
    }
}
