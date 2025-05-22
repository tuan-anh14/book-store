import React, { useEffect, useState } from 'react';
import { getBooksAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';

interface SearchResultsProps {
    searchQuery: string;
    onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery, onClose }) => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            if (!searchQuery) return;
            setLoading(true);
            try {
                const query = `current=${currentPage}&pageSize=${pageSize}&mainText=/${searchQuery}`;
                const response = await getBooksAPI(query);
                if (response && response.data) {
                    setBooks(response.data.result);
                    setTotalItems(response.data.meta.total);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
            setLoading(false);
        };
        const timeoutId = setTimeout(fetchBooks, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleBookClick = (bookId: string) => {
        navigate(`/book/${bookId}`);
        onClose();
    };

    if (!searchQuery) return null;

    return (
        <div className="search-results">
            {loading ? (
                <div className="loading">Đang tìm kiếm...</div>
            ) : books.length > 0 ? (
                <>
                    <div className="results-list">
                        {books.map(book => (
                            <div
                                key={book._id}
                                className="result-item"
                                onClick={() => handleBookClick(book._id)}
                            >
                                <div className="book-info">
                                    <h4>{book.mainText}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalItems > pageSize && (
                        <div className="pagination-container">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalItems}
                                onChange={handlePageChange}
                                size="small"
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="no-results">Không tìm thấy kết quả</div>
            )}
        </div>
    );
};

export default SearchResults; 