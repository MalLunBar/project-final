
import React from 'react'

export const TeamCard = ({ name, role, bio, img }) => (
  <div className="flex flex-col items-center text-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm w-full sm:w-[280px]">
    <div className="w-24 h-24 rounded-full bg-zinc-100 overflow-hidden mb-3">
      {img ? (
        <img src={img} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">Bild</div>
      )}
    </div>
    <h4 className="font-semibold">{name}</h4>
    <p className="text-sm text-zinc-600">{role}</p>
    {bio && <p className="text-sm text-zinc-600 mt-3">{bio}</p>}
  </div>
)
