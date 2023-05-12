import certificateBackground from 'images/Background/certification.jpg'

export const certificateTemplate = ({course_title, lesson_number, tutor_name, issue_date, user, scale}) => {
    return `<div style=" width: ${512*scale}px; height: ${368*scale}px; background-image: url('${certificateBackground}'); background-size: contain; font-size=${scale*8}px;">
    <div style="display: flex; align-items: center; flex-direction: column; width: 85%; padding-top: 20%; padding-left: 15% padding-right: 15%; box-sizing: border-box; font-size: ${scale*8}px";>
        <p style="font-size: 1.25em; margin-bottom: 0.5em;">完課證書</p>
        <h3 style="font-size: 1.75em; margin: 0">${course_title}</h3>
        <p style="font-size: 1.25em; margin: 0; margin-top: 0.5em;">茲證明</p>
        <h3 style="font-size: 1.75em; font-weight: 600; margin: 0; margin-top: 0.75em;">${user.first_name || user.username} ${user.last_name || ''}</h3>
        <div style="height: ${scale*2}px; background-color: #CECED0; width: 80%; margin-top: 0.5em;"></div>
        <p style="font-size: 1em; margin-top: 1em;">順利完成所有課程</p>
    </div>
    <div style="padding: 2.5em 8%; font-size: ${scale*8}px;">
        <table style="font-size: 1.125em; border-collapse: collapse; width: 50%">
            <tr>
                <td style="color: #2BBAEE; padding: 0.5em 0">課程堂數</td>
                <td style="padding: 0.5em 0">${lesson_number}</td>
            </tr>
            <tr>
                <td style="color: #2BBAEE; padding: 0.5em 0">完成日期</td>
                <td style="padding: 0.5em 0">${issue_date.getFullYear()}年${issue_date.getMonth()+1}月${issue_date.getDate()}日</td>
            </tr>
            <tr>
                <td style="color: #2BBAEE; padding: 0.5em 0">授課導師</td>
                <td style="padding: 0.5em 0">${tutor_name}</td>
            </tr>
        </table>
    </div>
</div>`
}