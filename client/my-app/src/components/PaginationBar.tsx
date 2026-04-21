const PaginationBar = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (targetPage: number) => void }): React.ReactElement => {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
      <button className="pagination-previous" aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        &#x25C0;
      </button>
      <button className="pagination-next" aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        &#x25B6;
      </button>
      <ul className="pagination-list">
        {pages.map((page) => (
          <li key={page}>
            <PageButton page={page} currentPage={currentPage}
              onClick={() => onPageChange(Number(page))}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

const PageButton = ({ page, currentPage, onClick }: { page: string | number, currentPage: string | number, onClick: () => void }): React.ReactElement => {
  if (page === currentPage) {
    return (
      <button className="pagination-link is-current"
        aria-label={`Page ${page}`} aria-current="page">
        {page}
      </button>
    );
  }
  if (page === '<' || page === '>') {
    return (
      <span className="pagination-ellipsis">
        &hellip;
      </span>
    );
  }
  return (
    <button className="pagination-link" aria-label={`Go to page ${page}`}
      onClick={onClick}>
      {page}
    </button>
  );
};

/**
 * Calculates a list of at most 7 pages to display.
 * Always includes the current, previous, next, first
 * and last ones if available.
 * 
 * @returns an array with the page numbers to display.
 * It can include the special `'<'` and `'>'` elements
 * to represent skipped pages.
 * 
 * @example
 * getVisiblePages(4, 5) // => [1, 2, 3, 4, 5]
 * getVisiblePages(4, 8) // => [1, 2, 3, 4, 5, '>', 8]
 * getVisiblePages(5, 8) // => [1, '<', 4, 5, 6, 7, 8]
 * getVisiblePages(5, 10) // => [1, '<', 4, 5, 6, '>', 10]
 */
const getVisiblePages = (current: number, total: number) => {
  if (total <= 7) {
    return range(total);
  }
  if (current < 5) {
    return [...range(5), '>', total];
  }
  if (current > total - 4) {
    return [1, '<', ...range(5, total - 4)];
  }
  return [1, '<', current - 1, current, current + 1, '>', total];
};

const range = (count: number, start = 1) => {
  return Array.from(new Array(count), (_, i) => i + start);
};

export default PaginationBar;
