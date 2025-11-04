import Logo from '../../assets/school-logo.png';

export default function ApplicationLogo(props) {
    return (
        <img src={Logo} alt="SATIS" {...props} />
    );
}
