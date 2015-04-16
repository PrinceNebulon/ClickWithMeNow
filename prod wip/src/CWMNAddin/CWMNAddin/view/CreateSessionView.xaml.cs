using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using ININ.Alliances.CWMNAddin.viewmodel;

namespace ININ.Alliances.CWMNAddin.view
{
    /// <summary>
    /// Interaction logic for CreateSessionView.xaml
    /// </summary>
    public partial class CreateSessionView : UserControl
    {
        public CwmnSessionViewModel CwmnSession
        {
            get { return DataContext as CwmnSessionViewModel; }
        }

        public CreateSessionView()
        {
            InitializeComponent();
        }

        private void StartSession_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                CwmnSession.StartSession();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
            }
        }

        private void Cancel_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                Window.GetWindow(this).Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
            }
        }

        private void CopyGuestLink_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                Clipboard.SetText(CwmnSession.GuestLink);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
            }
        }

        private void OpenGuestLink_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                Process.Start(CwmnSession.GuestLink);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
            }
        }

        private void CopyHostLink_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                Clipboard.SetText(CwmnSession.HostLink);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
            }
        }

        private void OpenHostLink_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                Process.Start(CwmnSession.HostLink);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                CwmnAddin.AddinTracer.Exception(ex);
            }
        }
    }
}
