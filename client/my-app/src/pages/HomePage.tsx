import JobList from '../components/JobList.tsx';
import { jobs } from '../constants/data.ts';

const HomePage = (): React.ReactElement => {
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
};

export default HomePage;
