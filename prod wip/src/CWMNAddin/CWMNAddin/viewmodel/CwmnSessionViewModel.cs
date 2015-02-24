using System.Collections.ObjectModel;
using ININ.Alliances.CWMNAddin.model;

namespace ININ.Alliances.CWMNAddin.viewmodel
{
    public class CwmnSessionViewModel : ViewModelBase
    {
        #region Private Fields

        private bool _simpleSessionType;
        private ObservableCollection<UrlViewModel> _urls = new ObservableCollection<UrlViewModel>();

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

        #endregion



        public CwmnSessionViewModel()
        {
            
        }



        #region Private Methods



        #endregion



        #region Public Methods



        #endregion
    }
}
