
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({value, text}) => {
    const ratingNumbers = [1, 2, 3, 4, 5];
    return (
        <div className="rating">
            {ratingNumbers.map((ratingNumber, index) => (
                <span>{value >= ratingNumber ? <FaStar /> : (
                    (value >= ratingNumber - 0.5) ? <FaStarHalfAlt /> : <FaRegStar />
                )}</span>
            ))}
            { text && <span className="rating-text">{text}</span> }
        </div>
    );
}

export default Rating;
