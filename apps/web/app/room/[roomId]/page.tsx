export default function Page({ params } : {
    params: {
        roomId: string
    }
}){
    return(
        <div>
            On {params.roomId}
        </div>
    )
}