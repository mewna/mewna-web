import React, { Component } from "react"

import Grid, { SideGrid, ProfileGrid } from "../../comp/GridContainer"
import Container from "../../comp/Container";
import SideCard from "../../comp/profile/SideCard";

export default class extends Component {
  render() {
    return (
      <Container>
        <ProfileGrid>
          <SideGrid>
            <SideCard>
              banana
            </SideCard>
            <SideCard>
              tuna salad
            </SideCard>
          </SideGrid>
          <Grid>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
            <div>tato</div>
          </Grid>
        </ProfileGrid>
      </Container>
    )
  }
  /*
  render() {
    return (
      <FourColGrid>
        {renderPost(
          "Winter 2018 Anime Review",
          "amy",
          "https://i.pinimg.com/originals/da/b2/d4/dab2d405730473923d33a32e814950cd.jpg"
        )}
        {renderPost(
          "How to have the coolest Discord server ever",
          "amy",
          "https://discordapp.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg"
        )}
        {renderPost(
          "Kittens of 2019 (so far)",
          "amy",
          "https://www.sonomamag.com/wp-content/uploads/2018/05/shutterstock_352176329.jpg"
        )}
        {renderPost(
          "Farming currency without getting banned",
          "amy",
          "https://static.greatbigcanvas.com/images/singlecanvas_thick_none/getty-images/pile-of-money,1008107.jpg?max=1000"
        )}
        {renderPost(
          "Getting help and reporting bugs",
          "amy",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Operation_Upshot-Knothole_-_Badger_001.jpg/705px-Operation_Upshot-Knothole_-_Badger_001.jpg"
        )}
      </FourColGrid>
    )
  }
  */
}
