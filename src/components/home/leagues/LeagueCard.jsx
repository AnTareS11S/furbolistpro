/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const LeagueCard = ({ data }) => {
  return (
    <article className='flex flex-wrap gap-7'>
      {data.map((league) => (
        <Card key={league._id} className='w-[250px] h-[100px] max-sm:w-full'>
          <Link to={`/leagues/${league._id}`}>
            <CardHeader className='items-center pt-10'>
              <CardTitle>{league.name}</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Link>
        </Card>
      ))}
    </article>
  );
};

export default LeagueCard;