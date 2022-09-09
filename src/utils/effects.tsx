import React from "react";

interface typing_eff_state {
    final_text: string
}
interface typing_eff_props {
    text: string,
    time_join_char: number
}
export class TypingEffect extends React.Component<typing_eff_props, typing_eff_state> {
    constructor(props: typing_eff_props) {
        super(props);
        this.state = {final_text: ""};
    }

    componentDidMount() {
        var char_array = this.props.text.split("");
        var limit_interval = char_array.length;

        let i = -1;
        var interval = setInterval(async() => {
            if(i === limit_interval - 2) {
                clearInterval(interval);
            }

            this.setState((state: typing_eff_state) => ({
                final_text: state.final_text + char_array[i]
              }));
            i++
        }, this.props.time_join_char)
    }
    render() {
        return (<p>{this.state.final_text}</p>)
    }
}