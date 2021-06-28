import kpn_logo from '../images/kpn.png' 

/**
 * Create and returns a JSX.Element Footer.
 * @returns {JSX.Element} A footer component
 */
const Footer = () => {
  return (
    <footer className='footer'>
      <p>Developed with <a style={{textDecoration:'none'}} href="https://gopher.golangmarket.com/products/gopher-plush">❤</a> by Tobias Schiphorst</p>
      <p><a style={{textDecoration:'none'}} href="https://www.kpn.com/"><img src={kpn_logo} alt='Powered by KPN'/></a></p>
    </footer>
  )
}

export default Footer