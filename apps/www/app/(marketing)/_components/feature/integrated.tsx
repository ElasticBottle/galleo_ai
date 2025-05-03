import Image from "next/image";
export function Integrated() {
  return (
    <Image
      src={"/integrated.png"}
      alt={"Integrated with outlook"}
      width={720}
      height={720}
      className="rounded-md "
    />
  );
}
