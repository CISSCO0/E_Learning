import QuestionBank from './components/QuestionBank'

export default async function QuestionBankMain({params}:{
    params:Promise<{
        moduleid: string;
    }>
})
{
    const moduleID = (await params).moduleid
  return (
    <main>
      <QuestionBank moduleID={moduleID}/>
    </main>
  )
}

