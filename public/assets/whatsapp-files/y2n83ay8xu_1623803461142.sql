-- --------------------------------------------------------
-- Host:                         192.95.58.229
-- Versión del servidor:         5.5.50-MariaDB - MariaDB Server
-- SO del servidor:              Linux
-- HeidiSQL Versión:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Volcando estructura de base de datos para bookersnap_new
CREATE DATABASE IF NOT EXISTS `bookersnap_new` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `bookersnap_new`;


-- Volcando estructura para tabla bookersnap_new.bs_chat_support
CREATE TABLE IF NOT EXISTS `bs_chat_support` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ms_microsite_id` bigint(20) unsigned NOT NULL,
  `bs_user_id` bigint(20) unsigned NOT NULL,
  `message` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL,
  `status` int(1) NOT NULL,
  `support` int(1) NOT NULL DEFAULT '1',
  `reviewed` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tabla temporal del chat entre micrositio y developer';

-- La exportación de datos fue deseleccionada.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
