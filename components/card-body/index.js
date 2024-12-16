import Link from "next/link";
export default function CardBody({ title, data }) {
  return (
    <div className="p-4">
      <h2 className="capitalize text-white font-semibold tracking-wide text-lg">
        {title}
      </h2>
      <ul>
        {data.map((item, index) => (
          <li key={index} className="text-sm capitalize">
            <Link href={`the-loai/${item.path}`} className="hover:text-white cursor-pointer">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
