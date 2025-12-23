import { Home } from 'layouts/Home/Home';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "src", "data", "portfolio.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);

  return {
    props: {
      projects: data,
      featureProjects: Object.freeze(data.sort((a,b)=>{
        
        if (a.index === undefined) return 1;
        if (b.index === undefined) return -1;
        if (a.features && !b.features) return -1;
        if (!a.features && b.features) return 1;

        
        return a.index - b.index;
        
      }).filter(item => item.features === true)),
    },
  };
}

export default Home;