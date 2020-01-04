import React from 'react';
import './../css/style.css'

class AboutUS extends React.Component {

    render() {
        return (
            <div className="font App" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <br /><br /><br /><br /><br />
                <div className="pageTitle">About Us</div>
                <br />
                <div className="row">
                    <div className="col-7">
                        <div className="container"></div>
                        <p className="container">
                            <p>
                                Our goal at Keep Vietnam Clean & Green (KVCG) is to raise awareness about the litter & trash problem in Vietnam. While we understand there are many other issues that impact the environment, our focus is on littering, as we believe it to be the most basic of environmental issues and the foundational basis of environmental education. We believe, “How can we educate people about issues like climate change, sustainable building, reusable energies and recycling when we can’t get the general population to stop littering?”
                            </p>
                            <p>
                                Our first program, started in June 2013, was the Green Ribbon Campaign that won the international Youth4Asia competition sponsored by the Asian Development Bank in 2015 when we worked with 15 universities in Vietnam to get over 40,000 pledges to not litter. We were honored to present our program to the Environment Ministers of all the countries in the Greater Mekong Region in Myanmar and then again in 2016 at the Asia Youth Conference in the Philippines.
                            </p>
                            <p>
                                In April 2015, we started our second program the Community Clean Ups on Phu Quoc Island. We have, since then, also organized clean ups in Han Noi, HCMC, Hoi An, Hue and Can Tho and have engaged over organizations to join the clean ups.                            </p>
                            <p>
                                In 2016, we developed the characters for the Green Turtle Army, a campaign targeting children. We are excited as these mascots will educate children about the negative impacts of littering. Our partners in this effort are (1) RMIT University’s Centre of Communication and Design, whose students designed the characters and (2) Saigon South International School, whose elementary and middle school students helped to create activities based on the Green Turtle Army characters.
                            </p>
                        </p>
                    </div>
                    <div className="col-5">
                        <img src="http://vietnamsachvaxanh.org/wp-content/uploads/a_MG_0443s.jpg" style={{ width: "100%" }}></img>
                    </div>
                </div>
            </div>
        )
    }
}

export default (AboutUS)
