using ININ.Client.Common.Interactions;

namespace ININ.Alliances.CWMNAddin.viewmodel
{
    public class InteractionViewModel : ViewModelBase
    {
        #region Private Fields



        #endregion



        #region Public Properties



        #endregion



        private InteractionViewModel(IInteraction interaction)
        {
            
        }



        #region Private Methods



        #endregion



        #region Public Methods

        

        #endregion



        #region Static Methods

        public static InteractionViewModel FromIInteraction(IInteraction interaction)
        {
            return new InteractionViewModel(interaction);
        }

        #endregion
    }
}
