import { useParams } from "solid-start";

export default function Poll() {
  const params = useParams();
  return <div>Poll Slug: {params.id}</div>;
}
