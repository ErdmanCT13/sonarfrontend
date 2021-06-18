import "./AppHeader.scss"


export default function AppHeader(){
    return (
        <div className="app-header">
            <div className="app-header__logo">
                SONAR
            </div>
            <div className="app-header__tabs">
                <div className="app-header__tab app-header__tab--artists"></div>
                <div className="app-header__tab app-header__tab--filter"></div>
                <div className="app-header__tab app-header__tab--events"></div>
            </div>
            <div className="app-header__avatar"></div>
        </div>
    )
}