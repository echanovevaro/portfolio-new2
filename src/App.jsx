import "./App.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const NUM_WORKS = 3

export default function App() {
  const [filter, setFilter] = useState("blur-dark")
  const [workCounter, setWorkCounter] = useState(0)
  const [isPlaying1, setIsPlaying1] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const [isPlaying3, setIsPlaying3] = useState(false)

  const functions = {
    1: setIsPlaying1,
    2: setIsPlaying2,
    3: setIsPlaying3,
  }
  const refSection2 = useRef(null)
  const isInView = useInView(refSection2, { once: true, amount: 0.9 })

  const disable = (e) => {
    let player = e.currentTarget
    const videos = player.parentNode.querySelectorAll("video")
    videos.forEach((video) => {
      if (video !== player.querySelector("video")) {
        video.parentNode.style.pointerEvents = "none"
      }
    })
  }
  const enable = (e) => {
    let player = e.currentTarget
    const videos = player.parentNode.querySelectorAll("video")
    videos.forEach((video) => {
      if (video !== e.currentTarget.querySelector("video")) {
        video.parentNode.style.pointerEvents = null
      } else {
        functions[video.id](false)
        video.load()
      }
    })
  }

  const load = (e) => {
    e.currentTarget.load()
  }

  const play = (e) => {
    console.log("play")
    if (
      e.currentTarget.parentNode.querySelector(".player:hover") &&
      e.currentTarget.parentNode.querySelector(".player:hover") ==
        e.currentTarget
    ) {
      e.currentTarget.querySelector("video").play()
      disable(e)
    }
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
    setWorkCounter(0)
    const { scrollY, innerHeight } = window

    if (
      scrollY > innerHeight - 200 &&
      scrollY < innerHeight + 200 &&
      filter !== "blur-bw"
    ) {
      setFilter("blur-bw")
    } else if (scrollY < innerHeight - 200 && filter !== "blur-dark") {
      setFilter("blur-dark")
    } else if (scrollY > innerHeight + 200 && filter !== "contact") {
      setFilter("contact")
    }
  }, [filter])

  const scroll = () => {
    window.scrollTo({
      top: window.scrollY + window.innerHeight,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
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
        setTimeout(next, 800)
      })
      counter = (counter + 1) % phrases.length
    }

    next()

    return () => {
      const links = document.querySelector('link[rel="preload"]')
      if (links && links.length > 0) {
        links.forEach((el) => el.remove())
      }
      menu.removeEventListener("click", toggleMenu)
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
                href="#home"
                title="home"
              >
                home
              </a>
            </li>
            <li>
              <a
                href="#works"
                title="works"
              >
                works
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
      <section
        className="w-full h-[100vh] text-sm relative"
        id="home"
      >
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
            filter === "blur-dark"
              ? "bg-[#002c3e]"
              : filter === "blur-bw" && workCounter === 0
              ? "bg-[#325664]"
              : filter === "blur-bw" && workCounter === 1
              ? "bg-[#aee2e2de]"
              : filter === "blur-bw" && workCounter === 2
              ? "bg-[#ecfbfbc8]"
              : "bg-[#66808b]"
          } transition ease-out duration-1000`}
        >
          <div className={`bouncing-blobs-glass ${filter}`} />
          <div className={"bouncing-blobs"}>
            <div className="bouncing-blob bouncing-blob--red" />
            <div className="bouncing-blob bouncing-blob--green" />
            <div className="bouncing-blob bouncing-blob--blue" />
          </div>
        </div>
        <div className="text-white  font-extralight absolute landscape:w-[calc(47*80vh/21)] w-[calc(21*80vh/39)] h-[80vh] top-[10%] landscape:left-[5vw] left-2 grid landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr_8fr_5fr] landscape:grid-rows-[5fr_1fr_2fr_5fr_3fr_5fr] grid-cols-[5fr_1fr_2fr_5fr_1fr_2fr_5fr] grid-rows-[8fr_2fr_3fr_21fr_2fr_3fr]">
          <div className="col-start-1 col-end-4 row-start-1 row-end-2 landscape:col-start-1 landscape:col-end-2 landscape:row-start-1 landscape:row-end-4 rounded-full bg-white bg-opacity-15 border border-white border-opacity-5 portrait:flex portrait:items-center portrait:justify-center">
            <h1 className="landscape:ml-[35%] landscape:mt-[50%] uppercase lg:text-base text-[0.75rem]">
              <span className="font-medium ">álvaro</span> riaño
            </h1>
          </div>
          <div className="col-start-4 col-end-8 row-start-1 row-end-4 landscape:col-start-1 landscape:col-end-5 landscape:row-start-4 landscape:row-end-8 rounded-full bg-white bg-opacity-[2%] portrait: flex items-start justify-center">
            <div className="landscape:ml-[6%] landscape:pt-[30%] pt-[50%] uppercase lg:text-lg text-sm portrait:flex portrait:flex-col portrait:items-end portrait:justify-center font-thin">
              <h1>
                <span className="font-light ">web</span> developer
              </h1>
              <span className="lg:text-5xl text-3xl uppercase block font-thin">
                portfolio
              </span>
            </div>
          </div>
          <div className="col-start-3 col-end-4 row-start-2 row-end-3 landscape:col-start-2 landscape:col-end-3 landscape:row-start-2 landscape:row-end-3 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-2 col-end-4 row-start-3 row-end-4 rounded-full bg-white bg-opacity-50"></div>
          <div className="portrait:hidden col-start-4 col-end-5 row-start-2 row-end-4 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-1 col-end-8 row-start-4 row-end-5 landscape:col-start-5 landscape:col-end-6 landscape:row-start-1 landscape:row-end-8 rounded-full border border-white border-opacity-20 relative">
            <div className="text lg:text-2xl text-base font-extralight absolute landscape:top-[62%] top-[59%] left-[10%]"></div>
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
      <section
        className="w-[100vw] h-[100vh] text-sm"
        id="works"
        ref={refSection2}
      >
        <div className="relative w-full h-full overflow-hidden">
          <div
            className={`${
              workCounter === 0 ? "text-slate-200" : "text-slate-900"
            }  font-light absolute landscape:w-[calc(47*80vh/21)] w-[calc(21*80vh/39)] h-[80vh] top-[10vh] landscape:left-[5vw] left-2 grid landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr_8fr_2fr_3fr] landscape:grid-rows-[5fr_1fr_2fr_5fr_2fr_1fr_5fr] grid-cols-[5fr_1fr_2fr_5fr_2fr_1fr_5fr] grid-rows-[8fr_2fr_3fr_21fr_3fr_2fr]`}
          >
            <div
              className="col-start-1 col-end-4 row-start-1 row-end-2 landscape:col-start-1 landscape:col-end-2 landscape:row-start-1 landscape:row-end-4 rounded-full bg-white bg-opacity-20 flex flex-col items-center justify-center"
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0s",
              }}
            >
              <h1 className="title font-thin lg:text-4xl text-3xl  uppercase block">
                works
              </h1>
              <span className="lg:text-xl text-[0.75rem] font-extralight">
                <b>0{workCounter + 1}</b> | 0{NUM_WORKS}
              </span>
            </div>
            <div
              className="col-start-4 col-end-8 row-start-1 row-end-4 landscape:col-start-1 landscape:col-end-5 landscape:row-start-4 landscape:row-end-8 rounded-full bg-white bg-opacity-[10%] flex flex-col justify-items-start justify-center text-left px-8 landscape:px-12 font-extralight border border-slate-900 border-opacity-15"
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
              }}
            >
              {workCounter === 0 && (
                <>
                  <h1
                    className="project landscape:hidden lg:text-2xl text-base font-extralight uppercase underline underline-offset-4 block mb-2 cursor-pointer"
                    onClick={() =>
                      window.open("https://hectoromero.art", "_blank")
                    }
                  >
                    HECTOROMERO{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-3 h-3 lg:h-4 lg:w-4 inline"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </h1>
                  <p className="description text-sm font-normal tracking-wide">
                    Artist website with admin mode.
                  </p>
                  <p className="description text-sm">
                    React, TanStack, React Router, Tailwind, and firebase.
                  </p>
                </>
              )}
              {workCounter === 1 && (
                <>
                  <h1
                    className="project landscape:hidden  lg:text-2xl text-base font-light uppercase block mb-2 cursor-pointer underline underline-offset-4"
                    onClick={() =>
                      window.open(
                        "https://next-js-meetup-crud-14.vercel.app/",
                        "_blank"
                      )
                    }
                  >
                    MEETUPS{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-3 h-3 lg:h-4 lg:w-4 inline"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </h1>
                  <p className="description text-sm font-normal tracking-wide">
                    Meetusp CRUD
                  </p>
                  <p className="description text-sm">
                    Next14, TanStack Query, React Router, Bootstrap, and
                    MongoDB.
                  </p>
                </>
              )}
              {workCounter === 2 && (
                <>
                  <h1
                    className="project landscape:hidden  lg:text-2xl text-base font-light uppercase block mb-2 cursor-pointer underline underline-offset-4"
                    onClick={() =>
                      window.open(
                        "https://jocular-sawine-5cf217.netlify.app/photographers",
                        "_blank"
                      )
                    }
                  >
                    PHOTOGRA<b>FY</b>{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-3 h-3 lg:h-4 lg:w-4 inline"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </h1>
                  <p className="description text-sm font-normal tracking-wide">
                    Photographers platform
                  </p>
                  <p className="description text-sm">
                    React, TanStack, React Router, Bootstrap, and firebase.
                  </p>
                </>
              )}
            </div>
            <div
              className="col-start-3 col-end-4 row-start-2 row-end-3 landscape:col-start-2 landscape:col-end-3 landscape:row-start-2 landscape:row-end-3 rounded-full border border-white border-opacity-20"
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.6s",
              }}
            ></div>
            <div
              className="col-start-2 col-end-4 row-start-3 row-end-4 rounded-full bg-white bg-opacity-50"
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.6s",
              }}
            ></div>
            <div className="portrait:hidden col-start-4 col-end-5 row-start-2 row-end-4 rounded-full border border-white border-opacity-20"></div>
            <div
              className="container col-start-1 col-end-8 row-start-4 row-end-5 landscape:col-start-5 landscape:col-end-6 landscape:row-start-1 landscape:row-end-8 rounded-full flex items-center justify-center"
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                filter: isInView ? "brightness(1)" : "brightness(0)",
                transition: "all 1.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.9s",
              }}
            >
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
                  className="relative w-full h-full"
                >
                  <div
                    className="player player2 absolute z-10 w-[70%] top-[43%] portrait:top-[43%] landscape:right-[2%] portrait:right-[2%] h-fit hover:scale-[140%] portrait:hover:scale-[140%] hover:z-20  transition ease-in duration-700 origin-bottom-right cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="2"
                      muted
                      playsInline
                      poster="/Meetup-update.png"
                      className={`w-full h-auto border-neutral-950 border-[4px] video-shadow rounded-lg`}
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
                      fill="rgba(255,255,255,0.5)"
                      viewBox="0 0 24 24"
                      strokeWidth={0.5}
                      stroke="white"
                      className={`pointer-events-none ${
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
                    className="transition ease-out duration-700 absolute z-[1] w-full h-full rounded-full backdrop-blur-sm border border-[rgb(0,44,62)] border-opacity-20  bg-white bg-opacity-30"
                    id="video-bg"
                  >
                    <div
                      id="text-bg1"
                      className="hidden description z-20  absolute text-slate-900 font-extralight left-[50%] translate-x-[-50%] h-[35%] w-[35%]  bg-[#ffffff] bg-opacity-30 rounded-full border border-[rgb(0,44,62)] border-opacity-20"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Create meetup</p>
                      </div>
                    </div>
                    <div
                      id="text-bg2"
                      className="hidden description z-20  absolute  text-slate-900 font-extralight  left-[50%] translate-x-[-50%] h-[35%] w-[35%] bg-[#ffffff] bg-opacity-30  border border-[rgb(0,44,62)] border-opacity-20 rounded-full"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Update meetup</p>
                      </div>
                    </div>
                    <div
                      id="text-bg3"
                      className="hidden description z-20  absolute  text-slate-900 font-extralight  left-[50%] translate-x-[-50%] h-[35%] w-[35%] bg-[#ffffff] bg-opacity-30  border border-[rgb(0,44,62)] border-opacity-20 rounded-full"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Responsive mobile</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="player player1 absolute z-[1] w-[90%] top-[15%] right-[9.3%] portrait:right-[10%] h-fit hover:scale-[123%] portrait:hover:scale-[112%] hover:z-20 transition ease-in duration-700 origin-top-left cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="1"
                      muted
                      playsInline
                      poster="/Meetup-Create.png"
                      className={`w-full h-auto border-neutral-950 border-[4px] video-shadow rounded-lg`}
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
                      fill="rgba(255,255,255,0.5)"
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
                    className="player player3 absolute z-10 w-[22%] bottom-[10%] portrait:bottom-0 left-[15%] h-fit hover:scale-[200%] hover:z-20 transition ease-in duration-700 origin-bottom-left cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="3"
                      muted
                      playsInline
                      poster="/Meetup-movil.png"
                      className={`w-full h-auto  border-neutral-950 border-[3px] video-shadow
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
                      fill="rgba(255,255,255,0.5)"
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
              {workCounter === 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 1 }}
                  className="relative w-full h-full"
                >
                  <div
                    className="player player2 absolute z-10 w-[70%] top-[40%] portrait:top-[45%] right-[5%] portrait:right-[2%] h-fit hover:scale-[150%] portrait:hover:scale-[140%] hover:z-20  transition ease-in duration-700 origin-bottom-right cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="2"
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
                    className="transition ease-out duration-700 absolute z-[1] w-full h-full rounded-full backdrop-blur-sm border border-[rgb(0,44,62)] border-opacity-20  bg-white bg-opacity-30"
                    id="video-bg"
                  >
                    <div
                      id="text-bg1"
                      className="hidden description z-20  absolute text-[#002c3e] font-extralight left-[50%] translate-x-[-50%] h-[35%] w-[35%]  bg-[#ffffff] bg-opacity-30 rounded-full border border-[#002c3e] border-opacity-20"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Admin mode</p>
                      </div>
                    </div>
                    <div
                      id="text-bg2"
                      className="hidden description z-20  absolute text-[#002c3e] font-extralight  left-[50%] translate-x-[-50%] h-[35%] w-[35%] bg-[#ffffff] bg-opacity-30  border border-[#002c3e] border-opacity-20 rounded-full"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Web scrolling</p>
                      </div>
                    </div>
                    <div
                      id="text-bg3"
                      className="hidden description z-20  absolute text-[#002c3e] font-extralight  left-[50%] translate-x-[-50%] h-[35%] w-[35%] bg-[#ffffff] bg-opacity-30  border border-[#002c3e] border-opacity-20 rounded-full"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Responsive mobile</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="player player1 absolute z-[1] w-[85%] top-[15%] portrait:top-[15%] right-[15%] portrait:right-[14%] h-fit hover:scale-[130%] portrait:hover:scale-[120%] hover:z-20 transition ease-in duration-700 origin-top-left cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="1"
                      muted
                      playsInline
                      poster="/hector-admin.png"
                      className={`w-full h-auto border-neutral-900 border-[4px] video-shadow rounded-lg`}
                      onPlay={() => setIsPlaying1(true)}
                      onEnded={(e) => {
                        setIsPlaying1(false)
                        load(e)
                      }}
                    >
                      <source
                        src="/hector-admin.mp4"
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
                    className="player player3 absolute z-10 w-[22%] bottom-[10%] portrait:bottom-[0%] portrait:left-[15%] left-[15%]  portrait:hover:scale-[220%] h-fit hover:scale-[180%]  hover:z-20 transition ease-in duration-700 origin-bottom-left cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="3"
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
                  className="relative w-full h-full"
                >
                  <div
                    className="player player1 absolute z-10 w-[45%] top-[53%] portrait:top-[50%] right-[6%] h-fit hover:scale-[160%] hover:z-20  transition ease-in duration-700 origin-bottom-right cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="2"
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
                    className="transition ease-out duration-700 absolute z-[1] w-full h-full rounded-full backdrop-blur-sm border border-[rgb(0,44,62)] border-opacity-20  bg-white bg-opacity-30"
                    id="video-bg"
                  >
                    <div
                      id="text-bg1"
                      className="hidden description z-20  absolute text-slate-900 font-extralight left-[50%] translate-x-[-50%] h-[35%] w-[35%]  bg-[#ffffff] bg-opacity-30 rounded-full border border-slate-900 border-opacity-20"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Publishing your work</p>
                      </div>
                    </div>
                    <div
                      id="text-bg2"
                      className="hidden description z-20  absolute text-slate-900 font-extralight  left-[50%] translate-x-[-50%] h-[35%] w-[35%] bg-[#ffffff] bg-opacity-30  border border-slate-900 border-opacity-20 rounded-full"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]"></div>
                      <p>Web tour</p>
                    </div>
                    <div
                      id="text-bg3"
                      className="hidden description z-20  absolute text-slate-900 font-extralight  left-[50%] translate-x-[-50%] h-[35%] w-[35%] bg-[#ffffff] bg-opacity-30  border border-slatetext-slate-900 border-opacity-20 rounded-full"
                    >
                      <div className="w-full h-full flex items-center justify-center text-[0.6rem]">
                        <p>Responsive mobile</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="player player2 absolute z-[1] w-[80%] top-[15%] portrait:top-[15%] right-[15%] portrait:right-[15%] h-fit hover:scale-125 portrait:hover:scale-110 hover:z-20 transition ease-in duration-700 origin-top-left cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="1"
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
                    className="player player3 absolute z-10 w-[22%] bottom-[0%] portrait:bottom-0 left-[30%] h-fit hover:scale-[200%] hover:z-20 transition ease-in duration-700 origin-bottom-left cursor-pointer"
                    onClick={(e) => play(e)}
                    onMouseLeave={(e) => enable(e)}
                  >
                    <video
                      id="3"
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
            <div
              className={`portrait:hidden col-start-6 col-end-7 row-start-5 row-end-8 rounded-full hover:border-opacity-40 border ${
                workCounter === 0 ? " border-white" : "border-slate-800"
              } border-opacity-15 flex items-center justify-center gap-2`}
            >
              {/* <span className="border-b"> */}
              {/* Visit site{" "} */}
              {/* <svg
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
                </svg> */}
              {/* </span> */}
              {workCounter === 0 && (
                <h1
                  className="project  lg:text-lg text-base font-extralight uppercase border-b-[0.5px] border-white border-opacity-40 block mb-2 cursor-pointer"
                  onClick={() =>
                    window.open("https://hectoromero.art", "_blank")
                  }
                >
                  HECTOROMERO{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-3 h-3 lg:h-4 lg:w-4 inline"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </h1>
              )}
              {workCounter === 1 && (
                <h1
                  className="project lg:text-lg text-base font-light uppercase block mb-2 cursor-pointer border-b-[0.5px] border-slate-900 border-opacity-40"
                  onClick={() =>
                    window.open(
                      "https://next-js-meetup-crud-14.vercel.app/",
                      "_blank"
                    )
                  }
                >
                  MEETUPS{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-3 h-3 lg:h-4 lg:w-4 inline"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </h1>
              )}
              {workCounter === 2 && (
                <h1
                  className="project lg:text-lg text-base font-light uppercase block mb-2 cursor-pointer border-b-[0.5px] border-slate-900 border-opacity-40"
                  onClick={() =>
                    window.open(
                      "https://jocular-sawine-5cf217.netlify.app/photographers",
                      "_blank"
                    )
                  }
                >
                  PHOTOGRA<b>FY</b>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-3 h-3 lg:h-4 lg:w-4 inline"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </h1>
              )}
            </div>
            {/* <div
              className={`landscape:hidden col-start-1 col-end-2 row-start-6 row-end-7 flex items-center justify-center gap-2`}
            >
              {new Array(NUM_WORKS)
                .fill("")
                .map((_, i) => i)
                .map((el) => (
                  <div
                    key={el}
                    className={`w-2 h-2 rounded-full ${
                      workCounter === 0 ? "bg-white" : "bg-slate-900"
                    } ${
                      workCounter === el ? "bg-opacity-50" : "bg-opacity-10"
                    }`}
                  ></div>
                ))}
            </div> */}

            <div
              className={`col-start-5 col-end-6 row-start-6 row-end-7 landscape:col-start-7 landscape:col-end-8 landscape:row-start-5 landscape:row-end-6 rounded-full border ${
                workCounter === 0
                  ? "border-white bg-white"
                  : " border-slate-800  bg-slate-800 "
              } border-opacity-50 flex items-center justify-center uppercase bg-opacity-10 transition-all hover:scale-110 duration-500 origin-top-right cursor-pointer`}
              onClick={slideLeft}
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                transition:
                  "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 1.2s, background-color .01s linear, color .01s linear, border-color .01s linear, border-opacity .01s linear",
              }}
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
              className={`col-start-5 col-end-7 row-start-5 row-end-6 landscape:col-start-8 landscape:col-end-9 landscape:row-start-5 landscape:row-end-7 rounded-full border duration-500 cursor-pointer ${
                workCounter === 0
                  ? "border-white bg-white"
                  : " border-slate-800  bg-slate-800 "
              } border-opacity-50 flex items-center justify-center uppercase bg-opacity-15 transition-all hover:scale-[105%] duration-500 origin-top-right portrait:origin-bottom-right  landscape:ps-6 cursor-pointer`}
              onClick={slideRight}
              style={{
                transform: isInView ? "unset" : "scale(0)",
                opacity: isInView ? 1 : 0,
                transition:
                  "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 1.2s, background-color .01s linear, color .01s linear, border-color .01s linear, border-opacity .01s linear",
              }}
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
              className="col-start-7 col-end-8 row-start-5 row-end-7 landscape:col-start-7 landscape:col-end-9 landscape:row-start-7 landscape:row-end-8 rounded-full bg-white bg-opacity-[3%] rotate-90 flex items-center justify-center transition ease-out duration-500 hover:border hover:border-white hover:border-opacity-20 hover:bg-opacity-5 cursor-pointer"
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
      <section
        className="w-[100vw] h-[100vh] text-sm relative"
        id="contact"
      >
        <div className="text-white  font-extralight absolute landscape:w-[calc(47*80vh/21)] w-[calc(21*80vh/39)] h-[80vh] top-[10%] landscape:left-[5vw] left-2 grid landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr_8fr_5fr] landscape:grid-rows-[5fr_1fr_2fr_5fr_3fr_5fr] grid-cols-[5fr_1fr_2fr_5fr_1fr_2fr_5fr] grid-rows-[8fr_2fr_3fr_21fr_2fr_3fr]">
          <div className="col-start-1 col-end-4 row-start-1 row-end-2 landscape:col-start-1 landscape:col-end-2 landscape:row-start-1 landscape:row-end-4 rounded-full bg-white bg-opacity-15 portrait:flex portrait:items-center portrait:justify-center">
            <h1 className="landscape:ml-[35%] landscape:mt-[50%] uppercase lg:text-base text-[0.75rem]">
              <span className="font-medium ">álvaro</span> riaño
            </h1>
          </div>
          <div className="col-start-4 col-end-8 row-start-1 row-end-4 landscape:col-start-1 landscape:col-end-5 landscape:row-start-4 landscape:row-end-8 rounded-full bg-white bg-opacity-[2%] portrait: flex items-start justify-center">
            <div className="landscape:ml-[6%] landscape:pt-[30%] pt-[50%] uppercase lg:text-lg text-sm portrait:flex portrait:flex-col portrait:items-end portrait:justify-center">
              <h1 className="text-[0.75rem] font-thin">Remote Madrid</h1>
              <span className="lg:text-5xl text-3xl uppercase block font-thin">
                contact
              </span>
            </div>
          </div>
          <div className="col-start-3 col-end-4 row-start-2 row-end-3 landscape:col-start-2 landscape:col-end-3 landscape:row-start-2 landscape:row-end-3 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-2 col-end-4 row-start-3 row-end-4 rounded-full bg-white bg-opacity-50"></div>
          <div className="portrait:hidden col-start-4 col-end-5 row-start-2 row-end-4 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-1 col-end-8 row-start-4 row-end-5 landscape:col-start-5 landscape:col-end-6 landscape:row-start-1 landscape:row-end-8 rounded-full border border-white border-opacity-20 relative">
            <div className="lg:text-3xl text-2xl font-thin absolute top-[40%] left-[10%] lg:leading-6 leading-5">
              <h1 className="uppercase">Send me a message</h1>
              <a
                className="text-base"
                href="mailto:echanovevaro@gmail.com"
              >
                echanovevaro@gmail.com
              </a>

              <a
                className="block leading-10 text-base pt-4"
                href="https://www.linkedin.com/in/alvaroriañoechanove"
                target="_blank"
              >
                Linkedin{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-3 h-3 lg:h-4 lg:w-4 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="col-start-6 col-end-7 row-start-5 row-end-6 landscape:col-start-6 landscape:col-end-7 landscape:row-start-5 landscape:row-end-7 rounded-full border border-white border-opacity-20"></div>
          <div className="col-start-7 col-end-8 row-start-5 row-end-7 landscape:col-start-7 landscape:col-end-8 landscape:row-start-6 landscape:row-end-7 rounded-full bg-white bg-opacity-[2%] rotate-90 flex items-center justify-center transition ease-out duration-500 hover:border hover:border-white hover:border-opacity-20 hover:bg-opacity-5 cursor-pointer"></div>
        </div>
        <div className="absolute bottom-3 right-6 text-white text-xs font-thin">
          &copy; Álvaro Riaño 2024
        </div>
      </section>
    </>
  )
}
