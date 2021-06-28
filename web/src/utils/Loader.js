import Page404 from './StatusPages';
import { useEffect, useState } from "react"
/**
 * Create and return a JSX Loader Element. This loader has a timer. If the timer surpasses 10 seconds then a JSX Page404 Element is returned.
 * @returns {JSX.Element}
 */
const Loader = () => {
    const [counter, setCounter] = useState(10)

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer)
    }, [counter])

    return (
        <div>
            {counter > 0 ? 
            <div className="loader">
                <div className="loader-wheel"></div>
                <div className="loader-text"></div>
            </div>
            : <Page404 />}   
        </div>
    )
}

export default Loader
