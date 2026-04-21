const description: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

interface Company {
  id: string,
  name: string,
  description: string
}

interface Job {
  id: string,
  title: string,
  date: Date,
  company: Company,
  description: string,
}

const getRandomId = (target: 'company' | 'job'): string => target.concat('-', crypto.randomUUID());

const companies: Company[] = [
  {
    id: getRandomId('company'),
    name: 'Company A',
    description,
  },
  {
    id: getRandomId('company'),
    name: 'Company B',
    description,
  },
];

const jobs: Job[] = [
  {
    id: getRandomId('job'),
    title: 'Job 1',
    date: new Date('2024-01-21'),
    company: companies[0],
    description
  },
  {
    id: getRandomId('job'),
    title: 'Job 2',
    date: new Date('2024-01-22'),
    company: companies[1],
    description,
  },
];

export {
  type Company,
  type Job,
  companies,
  jobs
}
