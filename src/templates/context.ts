import {
  faUndo,
  faRedo,
  faRectangleList,
  faCircle,
  faDiamond,
  faDotCircle,
  faBell,
  faCodeBranch,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { library, dom, icon } from "@fortawesome/fontawesome-svg-core";

library.add(faUndo, faRedo);
dom.watch();

export const context = {
  undoIcon: icon(faUndo).html,
  redoIcon: icon(faRedo).html,
  saveIcon: icon(faDownload).html,
  loadIcon: icon(faUpload).html,
  taskIcon: icon(faRectangleList).html,
  eventIcon: icon(faDotCircle).html,
  gatewayIcon: icon(faDiamond).html,
};
