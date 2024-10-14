import './footer.css';


function Footer(){
    const d = new Date();
    let year = d.getFullYear();
    return(
        <footer>
            {/*<img className="logo" src={logo} alt="Logo mySocial" />*/}
            <p className="footerText">© {year} mySocial. All rights reserved</p>
        </footer>
    );
};

export default Footer;