
namespace NanoRayTracing{
    export interface AppSpecification{
        name:string,
        version:string,
    }


    export class Application{
        private m_Specification:AppSpecification;
		private m_Running:boolean = false;


        constructor(){

        }
        PushLayer():void{

        }
        PushOverlay():void{

        }
        static GetInstance():Application{

        }
        GetSpecification():AppSpecification{

        }
        Run():void{
            this.m_Running = true;
            

            //Update.
            // for (auto& layer : m_LayerStack)
            //     layer.OnUpdate(m_TimeStep);

            //Timestep.
            // float time = GetTime();
			// m_FrameTime = time - m_LastFrameTime;
			// m_TimeStep = glm::min<float>(m_FrameTime, 0.0333f);
			// m_LastFrameTime = time;
        }

    }
}