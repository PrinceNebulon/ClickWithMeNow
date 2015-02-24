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
        public CwmnDialog()
        {
            InitializeComponent();

            DataContext = new CwmnSessionViewModel();
        }

        private void OnSessionTypeSelected(CwmnSessionType sessiontype)
        {
            try
            {
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
