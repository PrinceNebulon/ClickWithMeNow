using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ININ.Alliances.CWMNAddin.model;
using ININ.InteractionClient.Attributes;

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
        /// 0 = View
        /// 1 = Host
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
            Urls.Add(new UrlViewModel
            {
                DisplayText = "Google",
                Url = "http://google.com"
            });
            Urls.Add(new UrlViewModel
            {
                DisplayText = "Yahoo",
                Url = "http://yahoo.com"
            });
            Urls.Add(new UrlViewModel
            {
                DisplayText = "Interactive Intelligence, inc.",
                Url = "http://www.inin.com"
            });
            Urls.Add(new UrlViewModel
            {
                DisplayText = "Long URL",
                Url = "http://Somesite.com/path/to/page.html?query=string&things=something&whatever=1234"
            });
            Urls.Add(new UrlViewModel
            {
                DisplayText = "This link has a very long title. It's longer than it really needs to be to get the message across about what the link is for.",
                Url = "http://NotAnotherUrl.com"
            });
        }



        #region Private Methods



        #endregion



        #region Public Methods



        #endregion
    }
}
