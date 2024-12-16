import Image from 'next/image';

export default function DownloadApp() {
  return (
    <div className="p-4">
      <h2 className="font-bold uppercase text-white">Phương thức thanh toán</h2>
      <div className="flex mt-2">
        <Image
          src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
          alt="VNPAY"
          width={500}
          height={300}
          className="mr-2  w-auto h-[70px]"
        />
        {/* <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxVK2Ldio3wbcompe76GCOvyURqeR96FG-Ow&s"
          alt="Playstore"
          width={106}
          height={42}
          className=" w-auto h-[60px]"
        /> */}
      </div>
    </div>
  );
}
