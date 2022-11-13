export default class AudioSystem {
    max_audios: {menu: number, play: number, random: number};
    url: string;
    type: "menu" | "play" | "random";
    actual_playing?: HTMLAudioElement;
    constructor(type: "menu" | "play" | "random") {
        this.max_audios = {
            menu: 2,
            play: 0,
            random: 3
        };
        this.type = type;
        this.url = `${process.env.PUBLIC_URL}/audio/`;
    }

    #create_audio() {
        var number_audio = Math.floor(Math.random()*(this.max_audios[this.type]));
        var ran_audio_url = this.url + `${this.type}/${number_audio}.mp3`;
        var audio = new Audio(ran_audio_url);
        return audio;
    }

    async play(loop: boolean = false) {
        var audio: HTMLAudioElement;
        if(!this.actual_playing) {
            let created_audio = this.#create_audio();
            audio = created_audio;
            this.actual_playing = created_audio;
        }else if(this.type === "random"){
            let created_audio = this.#create_audio();
            audio = created_audio;
            this.actual_playing = created_audio;
        }else {
            audio = this.actual_playing;
        }
        audio.volume = 1;
        audio.currentTime = 0;
        if(loop) {
            audio.addEventListener("ended", () => {
                audio.currentTime = 0;
                setTimeout(() => {audio.play();}, 1000)
            });
        };
        await audio.play();
    }

    async slowy_stop() {
        if(!this.actual_playing) throw Error("Nada se esta reproduciendo.");
        if(this.actual_playing.volume === 0) return;
        var i = setInterval(() => {
            if(parseFloat(this.actual_playing!.volume.toString()).toFixed(1) === "0.1") {
                clearInterval(i);
                this.actual_playing!.currentTime = 0;
            }
            this.actual_playing!.volume -= 0.1;
        }, 90);
    }

    async mute() {
        if(!this.actual_playing) throw Error("Nada se esta reproduciendo.");
        this.actual_playing.volume = 0;
    }

    async unmute() {
        if(!this.actual_playing) throw Error("No esta pausado o el audio no existe.");
        this.actual_playing.volume = 1;
    }
}