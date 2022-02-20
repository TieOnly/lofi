const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.play-list')
const CD = $('.thumb-cd')

const heading = $('.audio-heading')
const thumbCd = $('.thumb-cd__img')
const audioOptionBtn = $('.audio-wrap__option')
const audioOption = $('.audio-wrap__option-list')
const volumeLine = $('.volume-input')
const fixedThumb = $('.audio-wrap__option-fix-thum')
const runSongBtn = $('.control__run')
const audio = $('#audio')
const lineProgress = $('.line-progress__input')

const nextBtn = $('.control__next')
const backBtn = $('.control__back')

const randomBtn = $('.control__random')
const repeatBtn = $('.control__repeat')

const PLAYER_STORAGE = 'TieOnly'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isSeeking: false,
    isRandom: false,
    isRepeat: false,
    isFixedThumb: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'At my worst lofi',
            author: 'Gustixa',
            path: './asset/song/At My Worst lofi - Gustixa.mp3',
            image: './asset/thumbSong/atmyworst.jpg'
        },
        {
            name: 'Eyes blue like the atlantic',
            author: 'Prod',
            path: './asset/song/eyes blue like the atlantic prod.mp3',
            image: './asset/thumbSong/eyesblueliketheatlantic.jpg'
        },
        {
            name: 'Goodbye to a world lofi',
            author: 'Porter Robinson',
            path: './asset/song/goodbye to a world lofi - Porter Robinson.mp3',
            image: './asset/thumbSong/goodbyeaworld.jpg'
        },
        {
            name: 'Night changes',
            author: 'One Direction',
            path: './asset/song/night changes - One Direction.mp3',
            image: './asset/thumbSong/nightchange.jpg'
        },
        {
            name: 'Slow dancing in the dark',
            author: 'Joji',
            path: './asset/song/slow dancing in the dark - Joji.mp3',
            image: './asset/thumbSong/slowdancinginthedark.jpg'
        },
        {
            name: 'Someone to you lofi',
            author: 'Shalom Margaret',
            path: './asset/song/Someone To You Lofi - Shalom margaret.mp3',
            image: './asset/thumbSong/someonetoyou.jpg'
        },
        {
            name: 'Someone you loved',
            author: 'Shalom Margaret',
            path: './asset/song/Someone You Loved - Shalom Margaret.mp3',
            image: './asset/thumbSong/someoneyouoloved.jpg'
        },
        {
            name: 'Terpesona lofi',
            author: 'Bulan',
            path: './asset/song/Terpesona lofi  - Bulan.mp3',
            image: './asset/thumbSong/terpesona.jpg'
        },
        {
            name: 'The girl ive never met',
            author: 'Gustixa',
            path: './asset/song/the girl ive never met - Gustixa .mp3',
            image: './asset/thumbSong/thegirlinevermet.jpg'
        },
        {
            name: 'Walking through a memory',
            author: 'Mishaal',
            path: './asset/song/walking through a memory Mishaal.mp3',
            image: './asset/thumbSong/walkingtroughamemory.jpg'
        },
    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom 
        this.isRepeat = this.config.isRepeat 
        this.currentIndex = this.config.currentIndex || 0
        audio.volume = this.config.volume || 1
        this.isFixedThumb = this.config.isFixedThumb
    },
    loadcurrentSong: function () {
        heading.innerText = `${this.currentSong.name}`
        thumbCd.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        if(this.currentIndex < this.songs.length - 1) {
            this.currentIndex++ 
        } else {
            this.currentIndex = 0
        }
    },
    backSong: function () {
        if(this.currentIndex != 0) {
            this.currentIndex-- 
        } else {
            this.currentIndex = this.songs.length - 1
        }
    },
    handelControl: function () {
        const _this = this
        const songCards = $$('.play-list__item')
        const runSong = function () {
            _this.loadcurrentSong()
            audio.play()
            cdThumbAnimate.play()
            addChoosing()
            pullCardSongUp()
            _this.setConfig('currentIndex', _this.currentIndex)
        }
        // Scrolling

        const cdWidth = $('.thumb-cd').offsetWidth;
        document.onscroll = function () {
            if(!_this.isFixedThumb) {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = Math.floor((cdWidth - scrollTop))
                CD.style.width = (newCdWidth > 0 ? newCdWidth : 0) + 'px'
                CD.style.opacity =  (newCdWidth > 0 ? newCdWidth / cdWidth : 0)
            }
        }
        // Around CD Thumb
        const cdThumbAnimate = thumbCd.animate([
            { transform: 'rotate(360deg)' }
        ],{
            duration: 20000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        // Run song
        runSongBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
                cdThumbAnimate.pause()
            } else {
                audio.play()
                cdThumbAnimate.play()
                addChoosing()
            }
        }
        // Play song
        audio.onplay = function () {
            _this.isPlaying = true
            runSongBtn.classList.add('playing')
        }
        // Pause song
        audio.onpause = function () {
            _this.isPlaying = false
            runSongBtn.classList.remove('playing')
        }
        // Line Progress
        audio.ontimeupdate = function () {
            const valueProgress = ((this.currentTime / this.duration) * 100).toFixed(3)
            const timeLine = isNaN(valueProgress) ? '0' : `${valueProgress}`
            if(!_this.isSeeking) {
                lineProgress.value = timeLine
            }
        }
        // Seek song
        lineProgress.onmousedown = function () {
            _this.isSeeking = true;
            lineProgress.onchange = function () {
                const newPosSong = (this.value / 100) * audio.duration
                audio.currentTime = newPosSong 
            }
        }
        lineProgress.onmouseup = function () {
            _this.isSeeking = false;
        }
        // Next song
        nextBtn.onclick = function () {
            if(_this.isRandom) {
                playRandom()
            } else {
                _this.nextSong()
            }
            runSong()
        }
        // Back song
        backBtn.onclick = function () {
            if(_this.isRandom) {
                playRandom()
            } else {
                _this.backSong()
            }
            runSong()
        }
        // Random run
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Random option
        let listPlayed = [_this.currentIndex]
        function playRandom() {
            let newCrtIndex
            if(listPlayed.length === _this.songs.length) {
                listPlayed = []
            }
            do {
                newCrtIndex = Math.floor(Math.random() * _this.songs.length)
            } while (newCrtIndex === _this.currentIndex || listPlayed.includes(newCrtIndex))
            
            listPlayed.push(newCrtIndex)
            _this.currentIndex = newCrtIndex
        }
        // Auto continue
        audio.onended = function () {
            if(_this.isRepeat) {
                lineProgress.value = '0'
                runSong()
            } else {
                nextBtn.click()
            }
        }
        // Repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Choose song / option
        for(var songCard of songCards) {
            songCard.onclick = function (e) {
                const thisDataID = this.getAttribute('data-id')
                if(thisDataID != _this.currentIndex && !e.target.closest('.play-list__item-option')) {
                    _this.currentIndex =  this.getAttribute('data-id')
                    runSong()
                } else if (thisDataID == _this.currentIndex && !e.target.closest('.play-list__item-option')) {
                    if(!_this.isPlaying) {
                        runSongBtn.click()
                    }
                } else {
                    // Choosed Option
                }
            }
        }
        function addChoosing() {
            for(var songCard of songCards) {
                if(songCard.getAttribute('data-id') == _this.currentIndex) {
                    removeChoosing()
                    songCard.classList.add('choosing')
                }
            }
        }
        function removeChoosing() {
            for(var songCard of songCards) {
                if(songCard.classList.contains('choosing')) {
                    songCard.classList.remove('choosing')
                }
            }
        }
        // Auto pull card song up
        function pullCardSongUp () {
            setTimeout( function () {
                $('.choosing').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                })
            }, 300)
        }
        // Audio option
        audioOptionBtn.onclick = function () {
            if(!this.classList.contains('active')) {
                this.classList.add('active')
                audioOption.style.display = 'block'
            } else {
                this.classList.remove('active')
                audioOption.style.display = 'none'
            }

        }
        audioOption.onclick = function (e) {
            e.stopPropagation()
        }
        // Audio volume
        volumeLine.onchange = function () {
            audio.volume = parseInt(this.value) / 100
            _this.setConfig('volume', audio.volume)
        }
        // Fixed ThumCD
        fixedThumb.onclick = function () {
            _this.isFixedThumb = !_this.isFixedThumb
            _this.setConfig('isFixedThumb', _this.isFixedThumb)
            fixedThumb.classList.toggle('ticked', _this.isFixedThumb)
        }
    },
    activeConfig: function () {
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        fixedThumb.classList.toggle('ticked', this.isFixedThumb)
        volumeLine.value = audio.volume * 100
    },
    renderSong: function () {
        const htmls = this.songs.map(function(song, index) {
            return `
                <li class="play-list__item" data-id="${index}">
                    <div class="play-list__item-img">
                        <div
                            style="background-image: url(${song.image});">
                        </div>
                    </div>
                    <div class="play-list__item-info">
                        <h3 class="play-list__item-info-head">
                            ${song.name}
                        </h3>
                        <p class="play-list__item-info-author">
                            ${song.author}
                        </p>
                    </div>
                    <div class="play-list__item-option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </li>
            `
        })
        $('.play-list__wrap').innerHTML = htmls.join('')
    },
    start: function () {
        this.loadConfig()
        
        this.defineProperties()
        
        this.renderSong()
        
        this.loadcurrentSong()
        
        this.handelControl()

        this.activeConfig()
    },
}

app.start();