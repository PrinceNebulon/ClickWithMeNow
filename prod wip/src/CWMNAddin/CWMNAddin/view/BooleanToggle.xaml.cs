using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using ININ.Alliances.CWMNAddin.Annotations;
using MessageBox = System.Windows.MessageBox;

namespace ININ.Alliances.CWMNAddin.view
{
    /// <summary>
    /// Interaction logic for BooleanToggle.xaml
    /// </summary>
    public partial class BooleanToggle : INotifyPropertyChanged
    {

        #region Private Fields



        #endregion



        #region Public Properties

        public event PropertyChangedEventHandler PropertyChanged;

        public static readonly DependencyProperty ValueProperty = DependencyProperty.Register(
            "Value", typeof (bool), typeof (BooleanToggle), new PropertyMetadata(false, ValuePropertyChanged));

        public bool Value
        {
            get { return (bool) GetValue(ValueProperty); }
            set
            {
                SetValue(ValueProperty, value);
                OnPropertyChanged();
            }
        }

        public static readonly DependencyProperty TrueColorProperty = DependencyProperty.Register(
            "TrueColor", typeof(Color), typeof(BooleanToggle), new PropertyMetadata(Colors.DarkGreen, ColorPropertyChanged));

        public Color TrueColor
        {
            get { return (Color) GetValue(TrueColorProperty); }
            set
            {
                SetValue(TrueColorProperty, value);
                OnPropertyChanged();
            }
        }

        public static readonly DependencyProperty FalseColorProperty = DependencyProperty.Register(
            "FalseColor", typeof(Color), typeof(BooleanToggle), new PropertyMetadata(Colors.DarkRed, ColorPropertyChanged));

        public Color FalseColor
        {
            get { return (Color) GetValue(FalseColorProperty); }
            set
            {
                SetValue(FalseColorProperty, value);
                OnPropertyChanged();
            }
        }

        public Brush TrueBackgroundBrush
        {
            get
            {
                return Value
                    ? new SolidColorBrush(TrueColor)
                    : new SolidColorBrush(Colors.DarkGray);
            }
        }

        public Brush FalseBackgroundBrush
        {
            get
            {
                return Value
                    ? new SolidColorBrush(Colors.DarkGray)
                    : new SolidColorBrush(FalseColor);
            }
        }

        public static readonly DependencyProperty TrueTextProperty = DependencyProperty.Register(
            "TrueText", typeof (string), typeof (BooleanToggle), new PropertyMetadata("on"));

        public string TrueText
        {
            get { return (string) GetValue(TrueTextProperty); }
            set
            {
                SetValue(TrueTextProperty, value);
                OnPropertyChanged();
            }
        }

        public static readonly DependencyProperty FalseTextProperty = DependencyProperty.Register(
            "FalseText", typeof (string), typeof (BooleanToggle), new PropertyMetadata("off"));

        public string FalseText
        {
            get { return (string) GetValue(FalseTextProperty); }
            set
            {
                SetValue(FalseTextProperty, value);
                OnPropertyChanged();
            }
        }

        #endregion



        public BooleanToggle()
        {
            InitializeComponent();
        }



        #region Private Methods

        private static void ValuePropertyChanged(DependencyObject sender, DependencyPropertyChangedEventArgs e)
        {
            try
            {
                // Cast to an instance of "this"
                var toggle = sender as BooleanToggle;
                if (toggle == null) throw new Exception("Sender was of unexpected type! Expected BooleanToggle; Encountered: " + sender.GetType());

                // Send notifications
                toggle.OnPropertyChanged("TrueBackgroundBrush");
                toggle.OnPropertyChanged("FalseBackgroundBrush");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private static void ColorPropertyChanged(DependencyObject sender, DependencyPropertyChangedEventArgs e)
        {
            try
            {
                // Cast to an instance of "this"
                var toggle = sender as BooleanToggle;
                if (toggle == null) throw new Exception("Sender was of unexpected type! Expected BooleanToggle; Encountered: " + sender.GetType());

                // Send notifications
                toggle.OnPropertyChanged("TrueBackgroundBrush");
                toggle.OnPropertyChanged("FalseBackgroundBrush");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private void Button_OnClick(object sender, RoutedEventArgs e)
        {
            try
            {
                Value = !Value;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        #endregion



        #region Public Methods

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }

        #endregion
    }
}
