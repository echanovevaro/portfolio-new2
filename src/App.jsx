import "./App.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const NUM_WORKS = 3

export default function App() {
  const [filter, setFilter] = useState("blur-dark")
  const [workCounter, setWorkCounter] = useState(0)
  const [isPlaying1, setIsPlaying1] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const [isPlaying3, setIsPlaying3] = useState(false)
  const ref = useRef(0)

  function onPanStart(_, info) {
    ref.current = info.point.x
  }

  function onPanEnd(_, info) {
    if (info.point.x < ref.current) {
      slideRight()
    } else if (info.point.x > ref.current) {
      slideLeft()
    }
  }

  const load = (e) => {
    e.currentTarget.load()
  }

  const play = (e) => {
    e.currentTarget.querySelector("video").play()
  }

  const slideLeft = () => {
    setIsPlaying1(false)
    setIsPlaying2(false)
    setIsPlaying3(false)
    workCounter > 0
      ? setWorkCounter(workCounter - 1)
      : setWorkCounter(NUM_WORKS - 1)
  }

  const slideRight = () => {
    setIsPlaying1(false)
    setIsPlaying2(false)
    setIsPlaying3(false)
    workCounter < NUM_WORKS - 1
      ? setWorkCounter(workCounter + 1)
      : setWorkCounter(0)
  }

  const onScroll = useCallback(() => {
    setIsPlaying1(false)
    setIsPlaying2(false)
    setIsPlaying3(false)
    const { scrollY, innerHeight } = window

    if (scrollY >= innerHeight && filter !== "blur-bw") {
      setFilter("blur-bw")
    } else if (scrollY < innerHeight && filter !== "blur-dark") {
      setFilter("blur-dark")
    }
  }, [filter])

  const scroll = () => {
    window.scrollTo({
      top: window.scrollY + window.innerHeight,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    class Blob {
      constructor(el) {
        this.el = el
        const boundingRect = this.el.getBoundingClientRect()
        this.size = boundingRect.width
        this.initialX = randomNumber(0, window.innerWidth - this.size)
        this.initialY = randomNumber(0, window.innerHeight - this.size)
        this.el.style.top = `${this.initialY}px`
        this.el.style.left = `${this.initialX}px`
        this.vx =
          randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
        this.vy =
          randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
        this.x = this.initialX
        this.y = this.initialY
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x >= window.innerWidth - this.size) {
          this.x = window.innerWidth - this.size
          this.vx *= -1
        }
        if (this.y >= window.innerHeight - this.size) {
          this.y = window.innerHeight - this.size
          this.vy *= -1
        }
        if (this.x <= 0) {
          this.x = 0
          this.vx *= -1
        }
        if (this.y <= 0) {
          this.y = 0
          this.vy *= -1
        }
      }

      move() {
        this.el.style.transform = `translate(${this.x - this.initialX}px, ${
          this.y - this.initialY
        }px)`
      }
    }
    function initBlobs() {
      const blobEls = document.querySelectorAll(".bouncing-blob")
      const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl))

      function update() {
        requestAnimationFrame(update)
        blobs.forEach((blob) => {
          blob.update()
          blob.move()
        })
      }

      requestAnimationFrame(update)
    }
    var menu = document.getElementsByClassName("open")[0]
    function toggleMenu() {
      menu.classList.toggle("oppenned")
    }

    menu.addEventListener("click", toggleMenu)
    window.addEventListener("scroll", onScroll)
    initBlobs()
    class TextScramble {
      constructor(el) {
        this.el = el
        this.chars = "!<>-_\\/[]{}—=+*^?#________"
        this.update = this.update.bind(this)
      }
      setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => (this.resolve = resolve))
        this.queue = []
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || ""
          const to = newText[i] || ""
          const start = Math.floor(Math.random() * 40)
          const end = start + Math.floor(Math.random() * 40)
          this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
      }
      update() {
        let output = ""
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i]
          if (this.frame >= end) {
            complete++
            output += to
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar()
              this.queue[i].char = char
            }
            output += `<span class="dud">${char}</span>`
          } else {
            output += from
          }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
          this.resolve()
        } else {
          this.frameRequest = requestAnimationFrame(this.update)
          this.frame++
        }
      }
      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
      }
    }

    // ——————————————————————————————————————————————————
    // Example
    // ——————————————————————————————————————————————————

    const phrases = [
      "Hi,",
      "my name is Varo,",
      "designer and front-end developer",
      "let's do something great together!",
    ]

    const el = document.querySelector(".text")
    const fx = new TextScramble(el)

    let counter = 0
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 2000)
      })
      counter = (counter + 1) % phrases.length
    }

    next()
    return () => {
      window.removeEventListener("scroll", onScroll)
      menu.removeEventListener("click", toggleMenu)
    }
  }, [onScroll])

  const MIN_SPEED = 1
  const MAX_SPEED = 1.5

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min
  }

  useEffect(() => {
    const imgLoader = function (src) {
      var link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = src

      document.head.appendChild(link)
    }

    imgLoader("/carrusel.png")
    imgLoader("/scroll-pantallas.png")
    imgLoader("/movil.png")
    imgLoader("/Meetup-update.png")
    imgLoader("/Meetup-Create.png")
    imgLoader("/Meetup-movil.png")
    imgLoader("/login-photografy.png")
    imgLoader("/visit-photogafhy.png")
    imgLoader("/movil-photografy.png")

    return () => {
      const links = document.querySelector('link[rel="preload"]')
      if (links && links.length > 0) {
        links.forEach((el) => el.remove())
      }
    }
  }, [])

  return (
    <>
      {/* <nav
        className={`text-white uppercase flex w-[80%] items-start justify-between fixed top-0 left-[10%] py-4 z-[9]
            `}
      > */}

      {/* </nav> */}
      <div
        className={`open font-extralight uppercase text-sm ${
          filter === "blur-bw" && workCounter !== 0 ? "line-dark" : ""
        }`}
      >
        <span className="cls" />
        <span>
          <ul className="sub-menu">
            <li>
              <a
                href="#about"
                title="about"
              >
                education
              </a>
            </li>
            <li>
              <a
                href="#skills"
                title="skills"
              >
                skills
              </a>
            </li>
            <li>
              <a
                href="#jobs"
                title="jobs"
              >
                works
              </a>
            </li>
            <li>
              <a
                href="#experience"
                title="experience"
              >
                experience
              </a>
            </li>
            <li>
              <a
                href="#contact"
                title="contact"
              >
                contact
              </a>
            </li>
          </ul>
        </span>
        <span className="cls" />
      </div>

      {/* <div
        className={`${
          !isPortada
            ? "fixed inset-x-0 bg-white top-0 h-16 z-[8] border-b"
            : "hidden"
        }`}
      ></div> */}
      <section className="w-full h-[100vh] text-sm relative">
        {/* <main className="absolute top-0 left-0 bg-gradient-to-r from-[#333] via-black to-black h-screen w-full">

        <div className="h-screen w-[300px] absolute top-0 right-0 overflow-hidden">
          <div className="bg-gradient-to-r from-black to-transparent z-[10] h-screen w-[300px] absolute top-0 right-0"></div>
          <video
            muted
            autoPlay
            loop
            preload="auto"
            className="transform -rotate-90 min-h-[100vh] min-w-[100vh] object-right-top absolute z-[9] brightness-200"
          >
            <source
              src="/cortado-comprimido.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </main> */}
        <div
          className={`bouncing-blobs-container ${
            filter === "blur-dark" || workCounter === 0
              ? "bg-[#002c3e]"
              : workCounter === 1
              ? "bg-[#aee2e2de]"
              : "bg-[#ecfbfbc8]"
          }`}
        >
          <div className={`bouncing-blobs-glass ${filter}`} />
          <div className={"bouncing-blobs"}>
            <div className="bouncing-blob bouncing-blob--red" />
            <div className="bouncing-blob bouncing-blob--green" />
            <div className="bouncing-blob bouncing-blob--blue" />
          </div>
        </div>
        <div className="text-white  font-extralight absolute landscape:w-[calc(47*80vh/21)] w-[calc(21*80vh/39)] h-[80vh] top-[10%] landscape:left-[5vw] left-2 grid landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr_8fr_5fr] landscape:grid-rows-[5fr_1fr_2fr_5fr_3fr_5fr] grid-cols-[5fr_1fr_2fr_5fr_1fr_2fr_5fr] grid-rows-[8fr_2fr_3fr_21fr_2fr_3fr]">
          <div className="col-start-1 col-end-4 row-start-1 row-end-2 landscape:col-start-1 landscape:col-end-2 landscape:row-start-1 landscape:row-end-4 rounded-full bg-white bg-opacity-15 border border-neutral-700 shadow-md portrait:flex portrait:items-center portrait:justify-center">
            <h1 className="landscape:ml-[35%] landscape:mt-[50%] uppercase lg:text-base text-[0.75rem]">
              <span className="font-medium ">álvaro</span> riaño
            </h1>
          </div>
          <div className="col-start-4 col-end-8 row-start-1 row-end-4 landscape:col-start-1 landscape:col-end-5 landscape:row-start-4 landscape:row-end-8 rounded-full bg-white bg-opacity-[2%] portrait: flex items-start justify-center">
            <div className="landscape:ml-[6%] landscape:pt-[30%] pt-[50%] uppercase lg:text-lg text-sm portrait:flex portrait:flex-col portrait:items-end portrait:justify-center">
              <h1>
                <span className="font-medium ">web</span> developer
              </h1>
              <span className="lg:text-5xl text-3xl uppercase block  color">
                portfolio
              </span>
            </div>
          </div>
          <div className="col-start-3 col-end-4 row-start-2 row-end-3 landscape:col-start-2 landscape:col-end-3 landscape:row-start-2 landscape:row-end-3 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-2 col-end-4 row-start-3 row-end-4 rounded-full bg-white bg-opacity-50"></div>
          <div className="portrait:hidden col-start-4 col-end-5 row-start-2 row-end-4 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-1 col-end-8 row-start-4 row-end-5 landscape:col-start-5 landscape:col-end-6 landscape:row-start-1 landscape:row-end-8 rounded-full border border-white border-opacity-20 relative">
            <div className="text lg:text-2xl text-lg font-extralight absolute landscape:top-[62%] top-[59%] left-[10%]" />
          </div>
          <div className="col-start-6 col-end-7 row-start-5 row-end-6 landscape:col-start-6 landscape:col-end-7 landscape:row-start-5 landscape:row-end-7 rounded-full border border-white border-opacity-20"></div>
          <div
            className="col-start-7 col-end-8 row-start-5 row-end-7 landscape:col-start-7 landscape:col-end-8 landscape:row-start-6 landscape:row-end-7 rounded-full bg-white bg-opacity-[2%] rotate-90 flex items-center justify-center transition ease-out duration-500 hover:border hover:border-white hover:border-opacity-20 hover:bg-opacity-5 cursor-pointer"
            onClick={scroll}
          >
            scroll
            <div className={`line`} />
          </div>
        </div>
      </section>
      <section className="w-[100vw] h-[100vh] text-sm">
        <div className="relative w-full h-full overflow-hidden">
          <div
            className={`${
              workCounter === 0 ? "text-slate-200" : "text-slate-900"
            }  font-light absolute landscape:w-[calc(47*80vh/21)] w-[calc(21*80vh/39)] h-[80vh] top-[10vh] landscape:left-[5vw] left-2 grid landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr_8fr_2fr_3fr] landscape:grid-rows-[5fr_1fr_2fr_5fr_2fr_1fr_5fr] grid-cols-[5fr_1fr_2fr_5fr_1fr_2fr_5fr] grid-rows-[8fr_2fr_3fr_21fr_2fr_3fr]`}
          >
            <div className="col-start-1 col-end-4 row-start-1 row-end-2 landscape:col-start-1 landscape:col-end-2 landscape:row-start-1 landscape:row-end-4 rounded-full bg-white bg-opacity-20 border border-neutral-200 border-opacity-50 flex flex-col items-center justify-center">
              <h1 className=" font-thin lg:text-4xl text-3xl  uppercase block">
                works
              </h1>
              <span className="lg:text-xl text-[0.75rem] font-thin">
                0{workCounter + 1} | 0{NUM_WORKS}
              </span>
            </div>
            <div className="landscape:ps-[20%] landscape:pt-[17%] ps-[20%] pt-[18%] col-start-4 col-end-8 row-start-1 row-end-4 landscape:col-start-1 landscape:col-end-5 landscape:row-start-4 landscape:row-end-8 rounded-full bg-white bg-opacity-[10%] flex flex-col items-start justify-start">
              <h2 className="lg:text-1xl font-thin uppercase block my-1">
                HECTOROMERO ART
              </h2>
              <p className="mr-[5%] portrait:text-[0.7rem] text-balance font-thin">
                lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                tristique, nunc nec vulputate tristique,
              </p>
            </div>
            <div className="col-start-3 col-end-4 row-start-2 row-end-3 landscape:col-start-2 landscape:col-end-3 landscape:row-start-2 landscape:row-end-3 rounded-full border border-white border-opacity-20"></div>
            <div className="col-start-2 col-end-4 row-start-3 row-end-4 rounded-full bg-white bg-opacity-50"></div>
            <div className="portrait:hidden col-start-4 col-end-5 row-start-2 row-end-4 rounded-full border border-white border-opacity-20"></div>
            <div className="container col-start-1 col-end-8 row-start-4 row-end-5 landscape:col-start-5 landscape:col-end-6 landscape:row-start-1 landscape:row-end-8 rounded-full flex items-center justify-center">
              {/* <div className="slide landscape:bg-[url('/desktop-computer-laptop-tablet-and-smartphone-psd.png')] portrait:bg-[url('/desktop-computer-laptop-tablet-and-smartphone-12-04-movil.png')] landscape:bg-[2rem] portrait:bg-[1rem] bg-contain bg-no-repeat absolute top-0 left-0 w-full h-full"></div> */}
              {/* <div className="slide landscape:bg-[url('/desktop-computer-laptop-tablet-and-smartphone-psd.png')] portrait:bg-[url('/desktop-computer-laptop-tablet-and-smartphone-12-04-movil.png')] landscape:bg-[2rem] portrait:bg-[1rem] bg-contain bg-no-repeat absolute top-0 left-0 w-full h-full"></div> */}
              {/* <img
              className=" ms-[6rem] object-cover w-full"
              src={`/desktop-computer-laptop-tablet-and-smartphone-psd.png`}
              alt="hectoromero"
            /> */}
              {workCounter === 1 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                  className="relative w-full h-full touch-pinch-zoom"
                  onPanStart={onPanStart}
                  onPanEnd={onPanEnd}
                >
                  <div
                    className="player absolute z-10 w-[70%] top-[40%] portrait:top-[45%] right-[5%] h-fit hover:scale-[140%] portrait:hover:scale-125 hover:z-20  transition ease-in duration-700 origin-bottom-right cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/Meetup-update.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying2(true)}
                      onEnded={(e) => {
                        setIsPlaying2(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/Meetup-update.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="#333"
                      className={`${
                        isPlaying2 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                  <div
                    className="transition ease-out duration-700 absolute z-[1] w-full h-full rounded-full border border-white border-opacity-20 backdrop-blur"
                    id="video-bg"
                  >
                    {" "}
                  </div>
                  <div
                    className="player absolute z-[1] w-[90%] top-[15%] right-[9.3%] portrait:right-[8%] h-fit hover:scale-[123%] portrait:hover:scale-110 hover:z-20 transition ease-in duration-700 origin-top-left cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/Meetup-Create.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying1(true)}
                      onEnded={(e) => {
                        setIsPlaying1(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/Meetup-Create.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="#333"
                      className={`${
                        isPlaying1 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                  <div
                    className="player absolute z-10 w-[22%] bottom-[10%] portrait:bottom-0 left-[15%] h-fit hover:scale-[200%] hover:z-20 transition ease-in duration-700 origin-bottom-left cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/Meetup-movil.png"
                      className={`w-full h-auto  border-neutral-900 border-[3px] video-shadow
              rounded-lg `}
                      onPlay={() => setIsPlaying3(true)}
                      onEnded={(e) => {
                        setIsPlaying3(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/Meetup-movil.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="#333"
                      className={`${
                        isPlaying3 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
              {workCounter === 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                  className="relative w-full h-full touch-pinch-zoom"
                  onPanStart={onPanStart}
                  onPanEnd={onPanEnd}
                >
                  <div
                    className="player absolute z-10 w-[70%] top-[40%] portrait:top-[45%] right-[5%] h-fit hover:scale-[130%] hover:z-20  transition ease-in duration-700 origin-bottom-right cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/carrusel.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying2(true)}
                      onEnded={(e) => {
                        setIsPlaying2(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/carrusel.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#333"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`${
                        isPlaying2 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                  <div
                    className="transition ease-out duration-700 absolute z-[1] w-full h-full rounded-full border border-white border-opacity-20 backdrop-blur"
                    id="video-bg"
                  >
                    {" "}
                  </div>
                  <div
                    className="player absolute z-[1] w-[85%] top-[15%] portrait:top-[10%] right-[15%] portrait:right-[10%] h-fit hover:scale-125 portrait:hover:scale-105 hover:z-20 transition ease-in duration-700 origin-top-left cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/scroll-pantallas.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying1(true)}
                      onEnded={(e) => {
                        setIsPlaying1(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/scroll-pantallas.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#333"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`${
                        isPlaying1 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                  <div
                    className="player absolute z-10 w-[22%] bottom-[10%] portrait:bottom-0 left-[15%]  h-fit hover:scale-[200%] hover:z-20 transition ease-in duration-700 origin-bottom-left cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/movil.png"
                      className={`w-full h-auto border-neutral-900 border-[3px] video-shadow
              rounded-lg`}
                      onPlay={() => setIsPlaying3(true)}
                      onEnded={(e) => {
                        setIsPlaying3(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/movil.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#333"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`${
                        isPlaying3 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
              {workCounter === 2 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                  className="relative w-full h-full touch-pinch-zoom"
                  onPanStart={onPanStart}
                  onPanEnd={onPanEnd}
                >
                  <div
                    className="player absolute z-10 w-[55%] top-[45%] portrait:top-[50%] right-[0%] h-fit hover:scale-[130%] hover:z-20  transition ease-in duration-700 origin-bottom-right cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/login-photografy.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying2(true)}
                      onEnded={(e) => {
                        setIsPlaying2(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/login-photografy.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#333"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`${
                        isPlaying2 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                  <div
                    className="transition ease-out duration-700 absolute z-[1] w-full h-full rounded-full border border-white border-opacity-20 backdrop-blur"
                    id="video-bg"
                  >
                    {" "}
                  </div>
                  <div
                    className="player absolute z-[1] w-[85%] top-[15%] portrait:top-[10%] right-[8%] portrait:right-[10%] h-fit hover:scale-125 portrait:hover:scale-110 hover:z-20 transition ease-in duration-700 origin-top-left cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/visit-photogafhy.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying1(true)}
                      onEnded={(e) => {
                        setIsPlaying1(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/visit-photogafhy.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#333"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`${
                        isPlaying1 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                  <div
                    className="player absolute z-10 w-[22%] bottom-[0%] portrait:bottom-0 left-[30%] h-fit hover:scale-[200%] hover:z-20 transition ease-in duration-700 origin-bottom-left cursor-pointer"
                    onClick={(e) => play(e)}
                  >
                    <video
                      muted
                      playsInline
                      poster="/movil-photografy.png"
                      className={`w-full h-auto border-neutral-900 border-[3px] video-shadow
              rounded-lg`}
                      onPlay={() => setIsPlaying3(true)}
                      onEnded={(e) => {
                        setIsPlaying3(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/movil-photografy.mp4"
                        type="video/mp4"
                      />
                    </video>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#333"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`${
                        isPlaying3 ? "hidden" : ""
                      } w-8 h-8 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="portrait:hidden col-start-6 col-end-7 row-start-5 row-end-8 rounded-full border border-white border-opacity-20 flex items-center justify-center gap-2 text-lg">
              <span className="border-b">
                Visit site{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </div>
            <div
              className={`col-start-6 col-end-7 row-start-5 row-end-6 landscape:col-start-7 landscape:col-end-8 landscape:row-start-5 landscape:row-end-6 rounded-full border ${
                workCounter === 0
                  ? "border-white bg-white"
                  : " border-slate-800  bg-slate-800 "
              } border-opacity-50 flex items-center justify-center uppercase bg-opacity-10 transition-all hover:scale-110 duration-500 origin-top-right portrait:origin-bottom-right cursor-pointer`}
              onClick={slideLeft}
            >
              <span className="portrait:hidden">prev</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 landscape:hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </div>
            <div
              className={`col-start-5 col-end-7 row-start-6 row-end-7 landscape:col-start-8 landscape:col-end-9 landscape:row-start-5 landscape:row-end-7 rounded-full border ${
                workCounter === 0
                  ? "border-white bg-white"
                  : " border-slate-800  bg-slate-800 "
              } border-opacity-50 flex items-center justify-center uppercase bg-opacity-15 transition-all hover:scale-[103%] duration-500 origin-top-right landscape:ps-6 cursor-pointer`}
              onClick={slideRight}
            >
              <span className="portrait:hidden">next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8 landscape:hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
            <div
              className="col-start-7 col-end-8 row-start-5 row-end-7 landscape:col-start-7 landscape:col-end-9 landscape:row-start-7 landscape:row-end-8 rounded-full landscape:bg-white landscape:bg-opacity-[10%] rotate-90 flex items-center justify-center transition ease-out duration-500 hover:border hover:border-white hover:border-opacity-20 hover:bg-opacity-5 cursor-pointer"
              onClick={scroll}
            >
              scroll
              <div
                className={`line ${
                  filter === "blur-dark" || workCounter === 0
                    ? ""
                    : "scroll-line-dark"
                }`}
              />
            </div>
            <div className="col-start-4 col-end-5"></div>
          </div>
        </div>
      </section>
    </>
  )
}
