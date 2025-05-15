import PropTypes from "prop-types";
import { JSX } from "react";
// import { Computer } from "./Computer";
import "./Logo.css";

interface Props {
    text: string;
}

export const LogoPlaceHolder = ({ text = "Logo" }: Props): JSX.Element => {
    return (
        <div className="logo-place-holder">
            {/* <Computer className="icons-computer" /> */}
            <div className="logo">{text}</div>
        </div>
    );
};

LogoPlaceHolder.propTypes = {
    text: PropTypes.string,
};