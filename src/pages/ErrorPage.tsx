type ErrorPageProps = {
  error?: Error;
};

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <div>
      ErrorPage
      <pre>{error?.message}</pre>
      <pre>{error?.stack}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}
