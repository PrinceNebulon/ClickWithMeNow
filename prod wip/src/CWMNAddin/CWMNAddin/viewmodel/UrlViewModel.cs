namespace ININ.Alliances.CWMNAddin.viewmodel
{
    public class UrlViewModel : ViewModelBase
    {
        private string _url;
        private string _displayText;
        private bool _isSelected;

        public string Url
        {
            get { return _url; }
            set
            {
                _url = value;
                OnPropertyChanged();
            }
        }

        public string DisplayText
        {
            get { return _displayText; }
            set
            {
                _displayText = value;
                OnPropertyChanged();
            }
        }

        public bool IsSelected
        {
            get { return _isSelected; }
            set
            {
                _isSelected = value;
                OnPropertyChanged();
            }
        }

        public override string ToString()
        {
            return DisplayText + (IsSelected ? "*" : "") + " - " + Url;
        }
    }
}