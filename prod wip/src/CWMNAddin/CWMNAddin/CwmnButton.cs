using System;
using System.Drawing;
using System.Windows.Forms;
using ININ.Alliances.CWMNAddin.view;
using ININ.Client.Common.Interactions;
using ININ.InteractionClient.Interactions;
using IInteraction = ININ.Client.Common.Interactions.IInteraction;

namespace ININ.Alliances.CWMNAddin
{
    public class CwmnButton : IInteractionButton
    {
        #region Private Fields



        #endregion



        #region Public Properties

        public string Id { get { return "CWMN_BUTTON"; } }
        public Icon Icon { get { return Resources.CwmnIcon; } }
        public string Text { get { return "Click With Me Now"; } }
        public string ToolTipText { get { return "Click to start a new CWMN session"; } }
        public SupportedInteractionTypes SupportedInteractionTypes { get { return SupportedInteractionTypes.All; } }

        #endregion



        public CwmnButton()
        {
        }



        #region Private Methods



        #endregion



        #region Public Methods

        public bool CanExecute(IInteraction selectedInteraction)
        {
            return selectedInteraction != null &&
                   (selectedInteraction.InteractionState != InteractionState.ExternalDisconnect &&
                    selectedInteraction.InteractionState != InteractionState.InternalDisconnect);
        }

        public void Execute(IInteraction selectedInteraction)
        {
            try
            {
                new CwmnDialog().Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error executing CWMN Button", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #endregion
    }
}
