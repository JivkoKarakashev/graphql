import { useParams } from 'react-router-dom';

import { companies } from '../constants/data.ts';

const CompanyPage = (): React.ReactElement => {
  const { companyId } = useParams();

  const company = companies.find((company) => company.id === companyId);
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
    </div>
  );
};

export default CompanyPage;
