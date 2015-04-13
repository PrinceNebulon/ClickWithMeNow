using System;
using System.Windows;
using ININ.Alliances.CwmnTypeLib;

namespace ININ.Alliances.CWMNAddin.view
{
    /// <summary>
    /// Interaction logic for CwmnHostOrGuest.xaml
    /// </summary>
    public partial class CwmnHostOrGuest
    {
        #region Private Fields



        #endregion



        #region Public Properties

        public delegate void SessionTypeSelectedHandler(CwmnSessionType sessionType);

        public event SessionTypeSelectedHandler SessionTypeSelected;

        #endregion



        public CwmnHostOrGuest()
        {
            InitializeComponent();
        }



        #region Private Methods

        private void RaiseSessionTypeSelected(CwmnSessionType sessionType)
        {
            if (SessionTypeSelected != null) SessionTypeSelected(sessionType);
        }

        #endregion



        #region Public Methods



        #endregion

        private void HostButton_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                RaiseSessionTypeSelected(CwmnSessionType.Host);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private void ViewButton_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                RaiseSessionTypeSelected(CwmnSessionType.View);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}
