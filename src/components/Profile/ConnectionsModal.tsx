import React, { useEffect, useState, useMemo } from 'react'
import { Connection, fetchConnections } from '../../services/db/profile/fetchConnections'
import Image from 'next/image'
import { MdGroups } from 'react-icons/md'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

interface Props {
  userEmail: string
  onClose: () => void
}

export const ConnectionsModal: React.FC<Props> = ({ userEmail, onClose }) => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [page, setPage] = useState(0)
  const pageSize = 4

  useEffect(() => {
    const load = async () => {
      const data = await fetchConnections(userEmail)
      setConnections(data)
    }
    load()
  }, [userEmail])

  const start = useMemo(() => page * pageSize, [page]);
  const paginated = useMemo(() => {
    return connections.slice(start, start + pageSize);
  }, [connections, start, pageSize]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-red-600 text-xl hover:scale-110">
          <IoClose />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
          <MdGroups size={28} className="text-blue-600" />
          Your Connections
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {paginated.length > 0 ? (
            paginated.map((conn, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Image
                  src={conn.profileImage}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                  alt={conn.name}
                />
                <span className="text-sm mt-1 text-center">{conn.name}</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500 text-sm col-span-2 text-center">No connections found.</span>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          {page > 0 && (
            <button
              onClick={() => setPage(p => p - 1)}
              className="text-blue-600 text-lg hover:scale-110"
              title="Previous"
            >
              <IoIosArrowBack size={24} />
            </button>
          )}
          {(start + pageSize < connections.length) && (
            <button
              onClick={() => setPage(p => p + 1)}
              className="text-blue-600 text-lg hover:scale-110"
              title="Next"
            >
              <IoIosArrowForward size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

