function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-5" aria-busy="true">
      <section className="overflow-hidden rounded-2xl border bg-white">
        <div className="h-28 bg-slate-200" />
        <div className="px-6 pb-6">
          <div className="-mt-11 h-24 w-24 rounded-full border-4 border-white bg-slate-200" />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-100" />
            </div>
            <div className="h-10 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="mt-6 flex gap-8">
            <div className="h-5 w-20 rounded bg-slate-100" />
            <div className="h-5 w-20 rounded bg-slate-100" />
          </div>
        </div>
      </section>

      <div className="h-5 w-24 rounded bg-slate-200" />
      <div className="h-36 rounded-2xl border bg-white" />
      <div className="h-36 rounded-2xl border bg-white" />
    </div>
  );
}

export default ProfileSkeleton;
