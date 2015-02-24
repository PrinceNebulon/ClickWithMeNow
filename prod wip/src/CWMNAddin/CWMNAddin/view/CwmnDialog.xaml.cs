using System;
using System.Windows;
using ININ.Alliances.CWMNAddin.model;
using ININ.Alliances.CWMNAddin.viewmodel;

namespace ININ.Alliances.CWMNAddin.view
{
    /// <summary>
    /// Interaction logic for CwmnDialog.xaml
    /// </summary>
    public partial class CwmnDialog
    {
        private CwmnSessionViewModel ViewModel { get { return DataContext as CwmnSessionViewModel; } }

        public CwmnDialog()
        {
            InitializeComponent();

            // Create new session vm
            var sessionvm = new CwmnSessionViewModel();

            //TODO: Remove debug URLs and replace with configurable list
            sessionvm.Urls.Add(new UrlViewModel
            {
                DisplayText = "Google",
                Url = "http://google.com"
            });
            sessionvm.Urls.Add(new UrlViewModel
            {
                DisplayText = "Yahoo",
                Url = "http://yahoo.com"
            });
            sessionvm.Urls.Add(new UrlViewModel
            {
                DisplayText = "Interactive Intelligence, inc.",
                Url = "http://www.inin.com"
            });
            sessionvm.Urls.Add(new UrlViewModel
            {
                DisplayText = "Long URL",
                Url = "http://Somesite.com/path/to/page.html?query=string&things=something&whatever=1234"
            });
            sessionvm.Urls.Add(new UrlViewModel
            {
                DisplayText = "This link has a very long title. It's longer than it really needs to be to get the message across about what the link is for.",
                Url = "http://NotAnotherUrl.com"
            });

            // Set to data context
            DataContext = sessionvm;
        }

        private void OnSessionTypeSelected(CwmnSessionType sessiontype)
        {
            try
            {
                ViewModel.SimpleSessionType = sessiontype == CwmnSessionType.Host;
                HostOrGuestPanel.Visibility = Visibility.Collapsed;
                SessionViewPanel.Visibility = Visibility.Visible;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}
