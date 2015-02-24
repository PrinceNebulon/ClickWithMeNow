using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Windows;
using ININ.Alliances.CWMNAddin.Annotations;

namespace ININ.Alliances.CWMNAddin.viewmodel
{
    public class ViewModelBase : INotifyPropertyChanged
    {
        protected SynchronizationContext Context { get; private set; }
        public event PropertyChangedEventHandler PropertyChanged;


        protected ViewModelBase()
        {
            Context = SynchronizationContext.Current;
            if (Context == null)
                MessageBox.Show("Type " + GetType() + " was not created on the UI thread!",
                    "UI Thread Synchronization Error", MessageBoxButton.OK, MessageBoxImage.Warning);
        }


        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null)
                Context.Send(s => handler(this, new PropertyChangedEventArgs(propertyName)), null);
        }
    }
}
