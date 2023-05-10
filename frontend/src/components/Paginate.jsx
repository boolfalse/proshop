
import {Pagination} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const Paginate = ({ pages, page, uriPrefix = '', keyword }) => {
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map((x) => {
                let uri = `${uriPrefix}/${x + 1}`;
                if (keyword) {
                    uri += '/search/'+keyword;
                }
                return (
                    <LinkContainer to={uri} key={x + 1}>
                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                    </LinkContainer>
                );
            })}
        </Pagination>
    );
};

export default Paginate;
