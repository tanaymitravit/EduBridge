import { useState, useRef, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Resume() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])
  
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        processSpeech(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        setIsLoading(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('')
      setIsRecording(true)
      recognitionRef.current.start()
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const processSpeech = async (userMessage) => {
    setIsLoading(true)
    try {
      console.log('Processing speech:', userMessage)

      // Get AI response from our backend
      const response = await fetch(`${API}/api/resume/mock-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: 'Software Engineer',
          question: userMessage,
          conversationHistory: conversationHistory.slice(-5)
        })
      })
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      const aiResponse = data.reply || 'I understand. Could you elaborate on that?'
      
      // Update conversation history
      const newExchange = { user: userMessage, interviewer: aiResponse }
      setConversationHistory(prev => [...prev, newExchange])
      
      // Convert AI response to speech
      await textToSpeech(aiResponse)
      
    } catch (error) {
      console.error('Error processing speech:', error)
      const errorMessage = 'Sorry, I encountered an error. Please try again.'
      await textToSpeech(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getBestVoice = () => {
    const voices = speechSynthesis.getVoices()
    
    // Preferred voices for natural conversation (in order of preference)
    const preferredVoices = [
      'Google UK English Female',
      'Google US English Female', 
      'Microsoft Zira Desktop - English (United States)',
      'Microsoft Hazel Desktop - English (Great Britain)',
      'Alex',
      'Samantha',
      'Victoria',
      'Karen'
    ]
    
    // Try to find a preferred voice
    for (const preferred of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preferred) || v.name === preferred)
      if (voice) {
        console.log('Selected voice:', voice.name)
        return voice
      }
    }
    
    // Fallback: find any English female voice
    const englishFemale = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('woman') ||
       v.name.toLowerCase().includes('zira') ||
       v.name.toLowerCase().includes('hazel') ||
       v.name.toLowerCase().includes('samantha') ||
       v.name.toLowerCase().includes('alex'))
    )
    
    if (englishFemale) {
      console.log('Selected fallback voice:', englishFemale.name)
      return englishFemale
    }
    
    // Last resort: any English voice
    const englishVoice = voices.find(v => v.lang.startsWith('en'))
    if (englishVoice) {
      console.log('Selected default English voice:', englishVoice.name)
      return englishVoice
    }
    
    console.log('No suitable voice found, using default')
    return null
  }

  const textToSpeech = async (text) => {
    try {
      setIsPlaying(true)
      
      if ('speechSynthesis' in window) {
        // Wait for voices to load if they haven't loaded yet
        if (speechSynthesis.getVoices().length === 0) {
          await new Promise(resolve => {
            speechSynthesis.onvoiceschanged = resolve
            // Fallback timeout
            setTimeout(resolve, 1000)
          })
        }
        
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Select the best available voice
        const selectedVoice = getBestVoice()
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
        
        // Optimized parameters for natural conversation
        utterance.rate = 0.85  // Slightly slower for more natural pace
        utterance.pitch = 0.95 // Slightly lower pitch for warmth
        utterance.volume = 0.9 // Slightly lower volume for comfort
        
        // Add natural pauses and emphasis
        utterance.text = text.replace(/\./g, '. ').replace(/\?/g, '? ').replace(/!/g, '! ')
        
        utterance.onend = () => {
          setIsPlaying(false)
        }
        
        utterance.onerror = (event) => {
          console.error('Browser TTS error:', event.error)
          setIsPlaying(false)
        }
        
        // Cancel any ongoing speech before starting new one
        speechSynthesis.cancel()
        speechSynthesis.speak(utterance)
      } else {
        throw new Error('Speech synthesis not supported')
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error)
      setIsPlaying(false)
    }
  }

  const startInterview = async () => {
    const welcomeMessage = "Hello! I'm your mock interviewer. Let's begin with a brief introduction. Tell me about yourself and why you're interested in this position."
    await textToSpeech(welcomeMessage)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl">
              🎤
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Mock Interviewer
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Click the microphone to start your interview with our AI agent
          </p>
        </div>

        {/* Start Interview Button */}
        {conversationHistory.length === 0 && (
          <button
            onClick={startInterview}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Interview
          </button>
        )}

        {/* Microphone Button */}
        <div className="space-y-6">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording ? 'bg-red-600 animate-pulse shadow-2xl shadow-red-500/50' : 
            isPlaying ? 'bg-blue-600 animate-pulse shadow-2xl shadow-blue-500/50' :
            isLoading ? 'bg-yellow-600 animate-pulse shadow-2xl shadow-yellow-500/50' :
            'bg-gray-700 hover:bg-gray-600 shadow-2xl shadow-gray-500/20'
          }`}>
            <button
              onClick={startRecording}
              disabled={isLoading || isPlaying || isRecording}
              className="w-full h-full rounded-full flex items-center justify-center text-white text-4xl disabled:cursor-not-allowed"
            >
              {isRecording ? '⏹️' : 
               isPlaying ? '🔊' :
               isLoading ? '⏳' :
               '🎤'}
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-lg font-medium">
              {isRecording ? 'Recording... Speak now' : 
               isLoading ? 'Processing your response...' :
               isPlaying ? 'Interviewer is speaking...' :
               'Click to speak'}
            </p>
            
            {transcript && (
              <div className="bg-gray-800 rounded-lg p-3 text-left">
                <p className="text-sm text-gray-400 mb-1">You said:</p>
                <p className="text-white">{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">
            Powered by Gemini AI + Browser Speech
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Natural conversation with professional interviewer
          </p>
        </div>
      </div>
    </div>
  )
}


