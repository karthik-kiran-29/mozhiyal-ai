import  {SarvamAIClient} from "sarvamai";

export const SarvamAIConfig = () => {
    return new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY
});
}