using System;
using System.Windows.Forms;
using ININ.Diagnostics;
using ININ.IceLib.Connection;
using ININ.InteractionClient;
using ININ.InteractionClient.AddIn;
using ININ.InteractionClient.Interactions;

namespace ININ.Alliances.CWMNAddin
{
    public class CwmnAddin : IAddIn
    {
        public static readonly ITopicTracer AddinTracer = TopicTracerFactory.CreateTopicTracer("ININ.Alliances.CwmnAddin");

        public void Load(IServiceProvider serviceProvider)
        {
            try
            {
                var session = serviceProvider != null
                    ? serviceProvider.GetService(typeof (Session)) as Session
                    : null;

                if (session == null)
                {
                    throw new Exception("Failed to get session!");
                }

                // Add CWMN button
                var service = ServiceLocator.Current.GetInstance<IClientInteractionButtonService>();
                if (service == null) throw new Exception("Unable to locate IClientInteractionButtonService service.");
                service.Add(new CwmnButton(session));
            }
            catch (Exception ex)
            {
                CwmnAddin.AddinTracer.Exception(ex);
                MessageBox.Show(
                    "Error on load: " + ex.Message + Environment.NewLine + Environment.NewLine +
                    "Please restart the Interaction Client and contact your system administrator if this issue persists.",
                    "Error loading CWMN Addin", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public void Unload()
        {
            
        }
    }
}
