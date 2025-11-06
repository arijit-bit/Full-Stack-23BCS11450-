import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import StopLogo from '/stop.svg';
import mic from '/mic.svg';
import send from '/send.svg';
import moon from '/moon.svg';
import sun from '/sun.svg';
import theam from '/theam.svg';
import bg1 from '/bg1.jpeg';
import bg2 from '/bg2.jpeg';
import bg3 from '/bg3.jpeg';
import bg4 from '/bg4.jpeg';
import bg5 from '/bg5.jpeg';
import bg6 from '/bg6.jpeg';
import Dbg from '/Dbg.jpg';
import slogo from '/logo.svg';
import Friday from '/Friday.webm';
import ArrowBack from '/ArrowBack.svg';
import ArrowB from '/arrow-back.svg'
import edit from '/edit.svg';
import chat from '/chat.svg'
import menu from '/menu.svg'
import AI from '/ai1.svg';
import VF from '/VF.svg';
import close from '/close.svg'
import micoff from '/micoff.svg'
import './App.css';

function App() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm();

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const [audio, setaudio] = useState(false);
  const [arrow, setarrow] = useState(true)
  const [newArrow, setnewArrow] = useState(false)
  const [visionAudio, setvisionAudio] = useState(false)
  const [vision, setvision] = useState(false)
  const [Aid, setAid] = useState(null);
  const [chats, setchats] = useState([]);
  const [outputs, setoutputs] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [count, setcount] = useState(0);
  const [bgname] = useState([Dbg, bg1, bg2, bg3, bg4, bg5, bg6]);
  const [bg, setbg] = useState(Dbg);
  const [VisionAudio, setVisionAudio] = useState(false);       // Mic listening state
  const [visionState, setVisionState] = useState("idle");      // idle | thinking | talking
  // const recognitionRef = useRef(null);


  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const fullText = "Hi..!\nI'm Friday. How Can I Help You Today?";

  const activechat = chats.find(chat => chat.id === Aid);

  //vison Assiatance
  const visionVoiceAssistance = () => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";
    let pauseTimer = null;

    const startPauseTimer = () => {
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(async () => {
        recognition.stop();
        setVisionAudio(false);
        setVisionState("thinking");

        const userInput = finalTranscript.trim();
        const response = await fetchVisionData(userInput);

        setVisionState("talking");
        speakVisionOutput(response, () => {
          finalTranscript = "";
          setVisionState("idle");
          visionVoiceAssistance(); // restart
        });
      }, 2500);
    };

    recognition.onstart = () => setVisionAudio(true);

    recognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (newTranscript.trim()) {
        finalTranscript += newTranscript;
        setValue("inputRequired", finalTranscript.trim(), { shouldValidate: true });
        startPauseTimer();
      }
    };

    recognition.onerror = () => {
      clearTimeout(pauseTimer);
      setVisionAudio(false);
      setVisionState("idle");
    };

    recognition.onend = () => {
      setVisionAudio(false);
      clearTimeout(pauseTimer);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };


  //fetch vision data
  const fetchVisionData = async (text) => {
    try {
      let newtext = `Assume your name is vision and you are a voice assistant, your reply should be small, concise to the point and in few sentences. The user input is: ${text}`
      const Vres = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({inputRequired: newtext })
      });

      if (!Vres.ok) throw new Error("Server error");

      const Vdata = await Vres.text();
      return Vdata;
    } catch (err) {
      console.error("Fetch error:", err);
      return "Error reaching Vision's brain.";
    }
  };

  //TTS conversion
  const speakVisionOutput = (text, onComplete) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = onComplete;
    synth.speak(utterance);
  };



  const handelVAoff = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setvisionAudio(false);
      setVisionState("idle");
    }
    setvisionAudio(false);
  }
  const handelVAon = () => {
    setvisionAudio(true)
    visionVoiceAssistance()
  }
  const handelVisionON = () => {
    setvision(true)
  }
  const handelVision = () => {
    setvision(false)
    handelVAoff();
  }
  const handelArrowBack = () => {
    setarrow(false)
  }
  const handelArrowGo = () => {
    setarrow(true)
  }
  const handelNewArrowGo = () => {
    setnewArrow(true)
  }
  const handelNewArrowBack = () => {
    setnewArrow(false)
  }


  const handleNewchat = () => {
    const newchat = {
      id: Date.now(),
      tittle: '',
      message: []
    };
    setchats(prev => [...prev, newchat]);
    setAid(newchat.id);
    setoutputs([]);
  };



  // Save chat history to localStorage when chats change
  useEffect(() => {
    localStorage.setItem('friday_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    const storedChats = localStorage.getItem('friday_chats');
    try {
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats);
        if (Array.isArray(parsedChats) && parsedChats.length > 0) {
          setchats(parsedChats);
          const lastChat = parsedChats[parsedChats.length - 1];
          setAid(lastChat.id);
          setoutputs(lastChat.message || []);
          return;
        }
      }

      // If no chat found, create only one chat manually here
      const newchat = {
        id: Date.now(),
        tittle: '',
        message: []
      };
      setchats([newchat]);
      setAid(newchat.id);
      setoutputs([]);

    } catch (err) {
      console.error('Error reading chat history:', err);
    }
  }, []);




  useEffect(() => {
    localStorage.setItem('friday_theme', JSON.stringify({ isDark, count }));
  }, [isDark, count]);


  useEffect(() => {
    const storedTheme = localStorage.getItem('friday_theme');
    if (storedTheme) {
      try {
        const { isDark, count } = JSON.parse(storedTheme);
        setIsDark(isDark);
        setcount(count);
      } catch (err) {
        console.error('Invalid theme data:', err);
      }
    }
  }, []);

  useEffect(() => {
    setbg(bgname[count]); // Automatically update bg from count
  }, [count]);

  useEffect(() => {
    if (outputs.length === 0 && index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [index, outputs]);

  const handleToggle = () => setIsDark(!isDark);

  const handelTheam = () => {
    setcount(prev => (prev >= bgname.length - 1 ? 0 : prev + 1));
    setbg(bgname[count]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputs]);

  // Sync outputs with the currently active chat
  useEffect(() => {
    if (Aid !== null) {
      setchats(prev =>
        prev.map(chat =>
          chat.id === Aid ? { ...chat, message: outputs } : chat
        )
      );
    }
  }, [outputs]);

  useEffect(() => {
    localStorage.removeItem('friday_chats');
  }, []);

  //Fetch Friday
  const onSubmit = async (data) => {
    setaudio(false);
    setValue("inputRequired", "");
    const newEntry = { data };
    setoutputs(prev => {
      const updatedOutputs = [...prev, newEntry];

      // Set chat title as the first user message
      setchats(prevChats =>
        prevChats.map(chat =>
          chat.id === Aid && chat.tittle === ''
            ? { ...chat, tittle: data.inputRequired }
            : chat
        )
      );

      return updatedOutputs;
    });


    try {
      const r = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!r.ok) throw new Error("Server error");

      const op = await r.text();
      setoutputs(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = op;
        return updated;
      });
    } catch (err) {
      setoutputs(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = "Error: " + err.message;
        return updated;
      });
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const voiceAssitance = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setaudio(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript + (event.results[i].isFinal ? "" : " ");
      }
      setValue("inputRequired", transcript, { shouldValidate: true });
    };

    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.onend = () => setaudio(false);

    recognitionRef.current = recognition;
    recognition.start();
  };



  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setaudio(false);
    }
  };

  return (
    <div className='flex items-center'>
      {/* vision if active */}
      {vision && (<div >
        <div className="h-screen w-screen bg-[#202123] absolute top-0 z-50 flex flex-col justify-center items-center">
          <div className='absolute left-0 top-0 flex items-center justify-center gap-3 mt-5 ml-5'>
            <img src={VF} className='w-[35px] rounded-[5px] shadow-md invert ' alt="" />
            <div className='text-2xl font-[cursive] text-white'>Vision</div>
          </div>
          <div>
            <div>
              {visionState === "thinking" && <div className="flex space-x-1">
              <span className="h-[30px] w-[30px] bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-[30px] w-[30px] bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-[30px] w-[30px] bg-white rounded-full animate-bounce"></span>
            </div>}
              {visionState === "talking" && <video src={Friday} className={`h-[150px] w-[150px] mt-5`} autoPlay loop muted playsInline />}
              {visionAudio && (<div className={`voice-dot mt-6 ${visionState==="thinking" && 'hidden'} ${visionState=== "talking" && 'hidden'}`}></div>)}
              {visionState === "idle" && (<div className={`bg-white w-[75px] h-[75px] rounded-full mt-5 ${visionAudio && 'hidden'}`}></div>)}
            </div>
          </div>
          <div className='flex gap-10 absolute bottom-0 mb-10'>
            {visionAudio ? (
              <button onClick={handelVAoff} className=' hover:bg-gray-700 rounded-full bg-[#444654]  flex justify-center items-center cursor-pointer p-5 '>
                <img src={mic} className='invert' alt="" />
              </button>) : (
              <button onClick={handelVAon} className='rounded-full bg-red-400  flex justify-center items-center cursor-pointer p-5 '>
                <img src={micoff} className='invert' alt="" />
              </button>)}


            <button onClick={handelVision} className='rounded-full hover:bg-gray-700 bg-[#444654]  flex justify-center items-center cursor-pointer p-5'>
              <img src={close} className='invert' alt="" />
            </button>
          </div>
        </div>
      </div>)}
      {/* Sidebar */}
      <div className='flex items-center'>
        {/* Sidebar */}
        {arrow ? (
          // ✅ Full Sidebar
          <div className={`bg-[#f5f5f5] flex flex-col opacity-95 text-black transition-all duration-300 backdrop-blur-2xl w-[20vw] max-[1100px]:w-[30vw] max-[800px]:hidden max-[800px]:absolute max-[800px]:w-[300px] max-[800px]:left-[-400px] z-10 h-screen ${isDark ? '' : 'invert'}`}>
            <div className='flex items-center mt-2 mx-2 justify-between'>
              <img src={slogo} className='w-[40px] cursor-pointer' alt="Logo" />
              <img src={ArrowBack} onClick={handelArrowBack} className='w-[50px] pl-5 cursor-pointer hover:bg-gray-300 transition-all p-4 hover:rounded-[10px]' alt="Back" />
            </div>

            <div onClick={handleNewchat} className='flex items-center gap-2 cursor-pointer mt-10 hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]'>
              <img src={edit} alt="Edit" />
              <div className='font-medium text-[17px]'>New Chat</div>
            </div>

            <div onClick={handelVisionON} className='flex items-center gap-2 cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px] '>
              <img src={VF} alt="VF" />
              <div className='font-medium text-[17px]'>Vision</div>
            </div>

            {/* Chat History */}
            <div className='cursor-pointer mt-10 flex flex-col max-h-[60vh] p-2'>
              <div className='hover:bg-gray-300 transition-all p-2 hover:rounded-[10px] gap-3'>Chats</div>
              <div className='overflow-y-auto h-full flex flex-col pb-[20vh]'>
                {[...chats].reverse().map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setAid(chat.id);
                      setoutputs(chat.message);
                    }}
                    className={`flex gap-2 hover:bg-gray-300 transition-all p-1 pl-2 hover:rounded-[10px] ${Aid === chat.id ? 'bg-gray-200 rounded-[10px]' : ''}`}>
                    <div className='flex overflow-x-hidden whitespace-nowrap text-ellipsis w-full'>
                      {chat.tittle}
                    </div>
                    <div>...</div>
                  </div>
                ))}
              </div>
            </div>

            <div onClick={handelVisionON} className='bg-white rounded-2xl cursor-pointer fixed justify-center h-[82.5px] border-t w-full left-0 bottom-0 backdrop-blur-2xl shadow-md flex p-3 items-center gap-2 '>
              <img src={VF} className='w-[30px]' alt="VF" />
              <div className='font-bold pr-5'>Try vision It's Amazing</div>
            </div>
          </div>
        ) : (
          // ✅ Small Sidebar
          <div className={`bg-[#f5f5f5] flex flex-col opacity-95 text-black transition-all duration-300 backdrop-blur-2xl w-[100px] z-10 h-screen max-[800px]:hidden border-r ${isDark ? '' : 'invert '}`}>
            <div className='flex items-center mt-2 justify-center'>
              <img src={menu} onClick={handelArrowGo} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-4 hover:rounded-[10px]' alt="Menu" />
            </div>

            <div onClick={handleNewchat} className='flex items-center mt-2 justify-center'>
              <img src={edit} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-4 hover:rounded-[10px]' alt="New Chat" />
            </div>

            <div onClick={handelVisionON} className='flex items-center mt-2 justify-center'>
              <img src={VF} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]' alt="Vision" />
            </div>

            <div className='flex items-center mt-2 justify-center'>
              <img src={chat} onClick={handelArrowGo} className='w-[52px] cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]' alt="Chat" />
            </div>

            <div className='bg-white rounded-2xl cursor-pointer fixed justify-center h-[82.5px] border-t w-full left-0 bottom-0 backdrop-blur-2xl shadow-md flex items-center gap-2'>
              <img src={AI} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]' alt="AI" />
            </div>
          </div>
        )}
      </div>


      {/* small arrow below 600px */}
      {!newArrow && (<div onClick={handelNewArrowGo} className='w-[20px] h-[80px] bg-gray-500 absolute z-30 rounded-br-2xl rounded-tr-2xl opacity-50 min-[600px]:hidden flex justify-center items-center hover:bg-gray-600 cursor-pointer'>
        <img src={ArrowB} className={`rotate-180 mr-3 `} alt="" />
      </div>)}


      {/* {//indipendent 800px - 600px small side bar } */}

      <div onClick={handelNewArrowGo} className={`bg-[#f5f5f5] flex flex-col opacity-95 text-black transition-all duration-300 backdrop-blur-2xl w-[100px] z-10 h-screen border-r max-[600px]:hidden min-[800px]:hidden ${isDark ? '' : 'invert '}`}>
        {!newArrow && (<><div className='flex items-center mt-2 justify-center'>
          <img src={menu} onClick={handelArrowGo} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-4 hover:rounded-[10px]' alt="" />
        </div>

          <div onClick={handleNewchat} className='flex items-center mt-2 justify-center'>
            <img src={edit} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-4 hover:rounded-[10px]' alt="" />
          </div>

          <div onClick={handelVisionON} className='flex items-center mt-2 justify-center '>
            <img src={VF} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]' alt="" />
          </div>

          <div className='flex items-center mt-2 justify-center'>
            <img src={chat} onClick={handelArrowGo} className='w-[52px] cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]' alt="" />
          </div>

          <div className='bg-white rounded-2xl cursor-pointer fixed justify-center h-[82.5px] border-t w-full left-0 bottom-0 backdrop-blur-2xl shadow-md flex items-center gap-2'>
            <img src={AI} className='w-[55px] cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]' alt="" />
          </div></>)}
      </div>

      {/* indipendent >800px full slide bar */}

      <div className={`bg-[#f5f5f5] flex flex-col opacity-95 text-black transition-all duration-300 backdrop-blur-2xl w-[20vw] max-[1100px]:w-[30vw] min-[800px]:hidden max-[800px]:absolute max-[800px]:w-[300px] max-[800px]:left-[-400px] z-10 h-screen ${isDark ? 'border-r' : 'invert'} ${newArrow ? "max-[800px]:left-[0px] max-[500px]:w-screen max-[500px]:pl-3" : ""} `}>
        <div className='flex items-center mt-2 mx-2 justify-between'>
          <img src={slogo} className='w-[40px] cursor-pointer' alt="Logo" />
          <img src={ArrowBack} onClick={handelNewArrowBack} className='w-[60px] pl-5 cursor-pointer hover:bg-gray-300 transition-all p-4 hover:rounded-[10px]' alt="Back" />
        </div>

        <div onClick={handleNewchat} className='flex items-center gap-2 cursor-pointer mt-10 hover:bg-gray-300 transition-all p-3 hover:rounded-[10px]'>
          <img src={edit} alt="Edit" />
          <div className='font-medium text-[17px]'>New Chat</div>
        </div>

        <div onClick={handelVisionON} className='flex items-center gap-2 cursor-pointer hover:bg-gray-300 transition-all p-3 hover:rounded-[10px] '>
          <img src={VF} alt="VF" />
          <div className='font-medium text-[17px]'>Vision</div>
        </div>

        {/* Chat History */}
        <div className='cursor-pointer mt-10 flex flex-col max-h-[60vh] p-2'>
          <div className='hover:bg-gray-300 transition-all p-2 hover:rounded-[10px] gap-3'>Chats</div>
          <div className='overflow-y-auto h-full flex flex-col pb-[20vh]'>
            {[...chats].reverse().map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setAid(chat.id);
                  setoutputs(chat.message);
                }}
                className={`flex gap-2 hover:bg-gray-300 transition-all p-1 pl-2 hover:rounded-[10px] ${Aid === chat.id ? 'bg-gray-200 rounded-[10px]' : ''}`}>
                <div className='flex overflow-x-hidden whitespace-nowrap text-ellipsis w-full'>
                  {chat.tittle}
                </div>
                <div>...</div>
              </div>
            ))}
          </div>
        </div>

        <div onClick={handelVisionON} className='bg-white rounded-2xl cursor-pointer fixed justify-center h-[82.5px] border-t w-full left-0 bottom-0 backdrop-blur-2xl shadow-md flex p-3 items-center gap-2 '>
          <img src={VF} className='w-[30px]' alt="VF" />
          <div className='font-bold pr-5'>Try vision It's Amazing</div>
        </div>
      </div>

      {/* Right Panel */}
      <div>
        <img src={bg} className='absolute w-screen h-screen object-cover left-0' alt="" />
        <div className={`flex flex-col h-screen bg-[#f5f5f5] text-black transition-all duration-300 opacity-80 backdrop-blur-2xl border-l border-black max-[800px]:border-none ${isDark ? '' : 'invert'} ${arrow ? 'w-[calc(100vw-20vw)] max-[1100px]:w-[calc(100vw-30vw)] max-[800px]:w-[calc(100vw-100px)] max-[600px]:w-screen' : 'w-[calc(100vw-100px)] border-none max-[800px]:w-[calc(100vw-100px)] max-[600px]:w-screen'}`}>
          {/* dsfsdfsdfsd/ */}
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center backdrop-blur-2xl shadow-md bg-white">
            <div className='flex items-center gap-3'>
              <img src={slogo} className="w-[35px] rounded-[5px] shadow-md" alt="" />
              <h1 className="text-xl font-semibold font-[cursive]">Friday</h1>
            </div>
            <div className={`flex justify-center items-center gap-3 cursor-pointer ${isDark ? '' : 'invert'}`}>
              <img src={theam} className='bg-gray-400 p-2 rounded-[10px] w-[35px] hover:bg-gray-500 transition-all' onClick={handelTheam} alt="Theme" />
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" onChange={handleToggle} checked={isDark} />
                <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${isDark ? "bg-blue-300" : "bg-gray-700"}`}>
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform duration-300 ${isDark ? "translate-x-6" : ""}`}>
                    {isDark ? <img src={sun} className="w-4.5 h-4.5 cursor-pointer" alt="Sun" /> : <img src={moon} className="w-4.5 h-4.5 cursor-pointer" alt="Moon" />}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Chat Display */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {outputs.length === 0 ? (
              <div className="flex justify-center items-center h-full flex-col space-y-4">
                <video src={Friday} className={`h-[150px] w-[150px] ${isDark ? '' : 'invert'}`} autoPlay loop muted playsInline />
                <div className="typewriter bg-transparent text-black text-center font-mono text-[1.2rem] whitespace-pre-wrap break-words">
                  <pre className="bg-transparent m-0 break-words whitespace-pre-wrap">{displayedText}</pre>
                  <span className="cursor">|</span>
                </div>
              </div>
            ) : (
              outputs.map((items, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div className="flex justify-end">
                    <div className={`bg-blue-600 text-white rounded-xl px-4 py-2 max-w-[75%] shadow-md break-words overflow-hidden ${isDark ? '' : 'invert'}`}>
                      {items.data.inputRequired}
                    </div>
                  </div>
                  <div>
                    <img src={slogo} alt="" />
                    <div className="flex justify-start">
                      <div className={`bg-gray-400 text-black font-medium rounded-xl px-4 py-2 max-w-[80%] shadow-md border break-words overflow-auto ml-5 ${isDark ? '' : 'invert'}`}>
                        {!items.output ? (
                          <div className="animate-pulse text-sm text-black">Thinking...</div>
                        ) : (
                          <ReactMarkdown>{items.output}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit(onSubmit)} className="sticky bottom-0 bg-white border-t p-4 backdrop-blur-2xl shadow-md rounded-2xl max-[550px]:p-2">
            <div className="flex items-end gap-2 max-[550px]:flex-col ">
              <textarea
                ref={textareaRef}
                {...register("inputRequired", { required: true })}
                placeholder="Ask anything..."
                className="flex-1 border border-gray-300 rounded-lg p-3 resize-none max-h-[20vh] bg-white text-black focus:outline-none focus:ring focus:border-blue-300 transition break-words max-[550px]:w-full"
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
                disabled={isSubmitting}
              />
              <div className='flex justify-between max-[550px]:w-full'>
                <div className='flex gap-2 cursor-pointer'>
                  <button onClick={handelVisionON} className='border rounded-2xl w-[40px] flex justify-center items-center min-[550px]:hidden'>
                    <img src={VF} alt="" />
                  </button>
                  <button className={`bg-white border-black border px-4 py-1 rounded-xl transition-all hover:bg-gray-900 hover:border-blue-300 cursor-pointer flex justify-center items-center  min-[550px]:hidden max-[550px]:px-3 ${isDark ? '' : 'invert'}`}>
                    <a className='font-bold text-[13px]' target='_' href="https://github.com/arijit-bit/">
                      @</a>
                  </button>
                </div>
                <div className='flex items-end max-[550px]:justify-between gap-2'>
                  <button
                    type="button"
                    onClick={() => {
                      if (!audio) voiceAssitance();
                      else stopListening();
                    }}
                    className={`border px-4 py-2 rounded-xl transition cursor-pointer max-[550px]:w-[45px]  max-[550px]:px-3 ${audio ? 'bg-red-200 border-red-400' : `bg-transparent ${isDark ? '' : 'invert border-white'}`} ${isDark ? '' : 'invert'}`}
                  >
                    <img className={`text-black cursor-pointer ${isDark ? '' : 'invert'}`} src={audio ? StopLogo : mic} alt="Voice" />
                  </button>
                  <button
                    type="submit"
                    className={`bg-gray-200 border-black border px-4 py-2 rounded-xl transition hover:bg-gray-300 hover:border-gray-50 cursor-pointer max-[550px]:w-[45px]  max-[550px]:px-3 ${isDark ? 'invert' : 'invert'}`}
                    disabled={isSubmitting}
                  >
                    <img src={send} className={`text-black invert cursor-pointer {isDark ? '' : 'invert'}`} alt="Send" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>


  );
}

export default App;
