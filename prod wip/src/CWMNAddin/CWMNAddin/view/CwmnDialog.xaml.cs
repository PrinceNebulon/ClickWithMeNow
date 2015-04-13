using System;
using System.Windows;
using ININ.Alliances.CWMNAddin.viewmodel;
using ININ.Alliances.CwmnTypeLib;

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
                DisplayText = "CWMN",
                Url = "http://clickwithmenow.com"
            });
            sessionvm.Urls.Add(new UrlViewModel
            {
                DisplayText = "tim dev",
                Url = "https://tim-cic4su5.dev2000.com/cwmn2/landing.html"
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
